'use strict';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { skateboard, viewPoints, transitionViews } from '../../config/objects.json';
import lerp from 'lerp';

const Halogen = require('halogen/RingLoader');

const path = require('path');
const createLoop = require('raf-loop');
const createScene = require('scene-template');
const loader = new THREE.JSONLoader();
const diff = require('deep-diff');

const CLEAR_COLOR = 0xffffff;
const SPLINE_SPEED = 100;
const ASSETS_PATH = '/assets/';

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.arcSamples = this.originSamples = this.rotationSamples = [];
    this.arcTime = SPLINE_SPEED;
    this.origin = new THREE.Vector3(0, 0, 0);
    window.origin = this.origin;
    this.state = {
      controlsEnabled: true,
      loaded: false
    };
  }

  componentDidMount() {
    let domElement = ReactDOM.findDOMNode(this.refs['main-scene']);
    this.initScene(domElement, () => {
      this.setState({loaded: true});
    });
    window.addEventListener('resize', () => this.resizeCanvas());
    domElement.addEventListener('touchstart', () => this.handleInput());
    domElement.addEventListener('mousewheel', () => this.handleInput());
    domElement.addEventListener('mousedown', () => this.handleInput());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.angle !== this.props.angle) {
      this.cameraRailTo(nextProps.angle);
    }
  }

  componentWillUnmount() {
    let domElement = ReactDOM.findDOMNode(this.refs['main-scene']);
    window.removeEventListener('resize', this.resizeCanvas);
    domElement.removeEventListener('touchstart', this.handleInput);
    domElement.removeEventListener('mousewheel', this.handleInput);
    domElement.removeEventListener('mousedown', this.handleInput);
  }

  handleInput() {
    !this.state.controlsEnabled ? goToDefault.call(this) : null;
    this.props.hamburger ? this.props.toggleHamburger(false) : null;
    function goToDefault() {
      this.cameraRailTo('default');
      this.setState({
        controlsEnabled: true
      });
    };
  }

  cameraRailTo(angle) {
    this.arcSamples = [];
    this.originSamples = [];
    this.rotationSamples = [];
    this.arcTime = 0;
    this.setState({
      controlsEnabled: false
    })
    let initialPoint = this.camera.position;
    let endPoint, newTarget, newRotation;
    switch(angle) {
      case 'wheels':
        endPoint = viewPoints['wheel-customization'].pos;
        newTarget = viewPoints['wheel-customization'].target;
        newRotation = viewPoints['wheel-customization'].rot;
        break;
      case 'deck':
        endPoint = viewPoints['deck-customization'].pos;  
        newTarget = viewPoints['deck-customization'].target;  
        newRotation = viewPoints['deck-customization'].rot;  
        break;
      case 'wood':
        endPoint = viewPoints['wood-customization'].pos;
        newTarget = viewPoints['wood-customization'].target;
        newRotation = viewPoints['wood-customization'].rot;
        break;
      case 'component':
        endPoint = viewPoints['component-customization'].pos;
        newTarget = viewPoints['component-customization'].target;
        newRotation = viewPoints['component-customization'].rot;
        break;
      case 'default':
        endPoint = viewPoints['default'].pos;
        newTarget = viewPoints['default'].target;
        newRotation = viewPoints['default'].rot;
        break;
      default:
        return;
    }
    endPoint = new THREE.Vector3(
      endPoint[0], endPoint[1], endPoint[2]
    );
    let centrePoint = midPoint(initialPoint, endPoint);
    let curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = initialPoint;
    curve.v1 = centrePoint;
    curve.v2 = endPoint;
    for(var i = 0; i < SPLINE_SPEED; i++) {
      let s = curve.getPoint(i/SPLINE_SPEED);
      this.arcSamples.push([s.x, s.y, s.z]);
      this.originSamples.push( new THREE.Vector3(
          lerp(this.origin.x, newTarget[0], i/SPLINE_SPEED),
          lerp(this.origin.x, newTarget[1], i/SPLINE_SPEED),
          lerp(this.origin.x, newTarget[2], i/SPLINE_SPEED)
        )
      );
      newRotation ? this.rotationSamples.push([
        lerp(this.camera.rotation.x, newRotation[0], i/SPLINE_SPEED),
        lerp(this.camera.rotation.y, newRotation[1], i/SPLINE_SPEED),
        lerp(this.camera.rotation.z, newRotation[2], i/SPLINE_SPEED)
      ]) : null;
    }
    
    this.newRotation = newRotation;
    function midPoint(i, e) {
      return new THREE.Vector3(
        (i.x + e.x)/2,
        (i.y + e.y)/2,
        (i.z + e.z)/2
      )
    }
  }

  resizeCanvas() {
    let el = ReactDOM.findDOMNode(this.refs['main-scene']);
    this.renderer.setSize(el.clientWidth, window.innerWidth * 0.56);
  }

  initScene(el, cb) {
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    const light = new THREE.SpotLight(0xffffff);
    const width = window.innerWidth;
    const height = window.innerWidth * 0.56;
    light.intensity = 1;
    ambient.intensity = 1;
    const opts = {
      renderer: {
        antialias: true,
      },
      width,
      height,
      controls: {
        theta: 0 * Math.PI / 180,
        phi: -55 * Math.PI / 180,
        distance: 6,
        type: 'orbit',
        element: el
      },
      camera: {
        far: 100000
      },
      domElement: el
    };

    let { 
      renderer,
      camera,
      scene,
      controls,
      updateControls
    } = createScene(opts, THREE);
    light.position.set(10, 5, -10);
    light.lookAt(this.origin);
    scene.add(ambient);
    scene.add(light);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor(CLEAR_COLOR, 1);   
    Object.assign(this, { 
      renderer, 
      camera, 
      scene, 
      controls,
      updateControls 
    });
    if(process.env.NODE_ENV !== 'production') {
      window.scene = this.scene;
      window.camera = this.camera;
      window.controls = this.controls;
    }
    this.initReflectivePlane(scene);
    this.initMainObject(scene, (obj) => {
      this.scene.add(obj);
      this.props.updateMaterialsLibrary({
        deck: obj.children.filter((d) => d.name === 'DECK')[0].material,
        wheels: obj.children.filter((d) => d.name === 'WHEELS')[0].material,
        screws: obj.children.filter((d) => d.name === 'SCREWS')[0].material
      });   
      let index = 0;
      createLoop((dt) => {
        this.animateArc();
        this.state.controlsEnabled ? updateControls() : null;

        if(++index === 30) {
          index = 0;
          this.road.visible = false;
          this.mirrorPlaneMaterial.envMap = this.mirrorPlaneCamera.renderTarget.texture;
          this.mirrorPlaneCamera.updateCubeMap(this.renderer, this.scene);
          this.road.visible = true;          
        }
      
        renderer.render(this.scene, this.camera);
      }).start();  
      cb ? cb() : null;
    });
  }

  initReflectivePlane(scene) {
    let light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(-2.7, 2, 3);
    light.castShadow = true;
    light.angle = 0.52;
    light.decay = 2;
    light.distance = 20;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 20;
    light.name = 'the spotlight';
    light.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(light);    
    let mirrorPlaneCamera = new THREE.CubeCamera(1,1000, 512);
    mirrorPlaneCamera.name = 'mirror camera';
    mirrorPlaneCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add(mirrorPlaneCamera);
    mirrorPlaneCamera.position.set(0, -3.8, 0);
    mirrorPlaneCamera.rotation.set(0, 0, 0);

    let tex = new THREE.TextureLoader().load(ASSETS_PATH + 'models/textures/metal15.jpg');
    let roadGeom = new THREE.PlaneGeometry(30, 30, 300);

    let mirrorPlaneMaterial = new THREE.MeshLambertMaterial({
      normalMap: tex.normal,
      specularMap: tex.specular,
      reflectivity: 0.25,
      envMap: mirrorPlaneCamera.renderTarget.texture,
      bumpMap: tex
    });
    let road = new THREE.Mesh(
      roadGeom,
      mirrorPlaneMaterial
    );
    road.name = 'road';
    road.receiveShadow = true;
    road.position.set(0, -0.28, 0);
    road.rotation.set(-Math.PI/2, 0, 0);
    scene.add(road);
    Object.assign(this, {
      road,
      mirrorPlaneCamera,
      mirrorPlaneMaterial
    });
  }

  animateArc() {
    if(this.arcTime >= SPLINE_SPEED) return;
    let factor = this.arcTime / SPLINE_SPEED;
    this.camera.position.fromArray(this.arcSamples[this.arcTime]);
    this.controls.position = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];
    this.camera.lookAt(this.originSamples[this.arcTime]);
    this.newRotation ? 
    this.camera.rotation.fromArray(this.rotationSamples[this.arcTime])
    : null;
    this.arcTime++;
  }

  initMainObject(scene, cb) {
    let mainObj = new THREE.Object3D();
    loadDeck(mainObj, () => {
      loadWheels(mainObj, () => {
        loadScrews(mainObj, () => cb(mainObj))
      });
    });

    function loadDeck(obj, cb) {
      loader.load(ASSETS_PATH + skateboard.deck, (geo, mat) => {        
        let material = new THREE.MultiMaterial(mat);
        // add sandpaper texture to deck
        let map = new THREE.TextureLoader().load(ASSETS_PATH + 'models/textures/sandpaper.png', () =>{
          map.anisotropy = 1;
          map.repeat.set(7, 7);
          map.wrapS = map.wrapT = THREE.RepeatWrapping;    
          Object.assign(material.materials[1], {
            bumpMap: map,
            bumpScale: 0.1
          });
          let newObj = new THREE.Mesh(geo, material);
          newObj.name = 'DECK';
          obj.add(newObj);
          cb ? cb() : null  
        });
      });
    }

    function loadWheels(obj, cb) {
      loader.load(ASSETS_PATH + skateboard.wheels, (geo, mat) => {
        let map  =new THREE.TextureLoader().load(ASSETS_PATH + 'models/textures/powder-coat.jpg', () => {
          let material = new THREE.MultiMaterial(mat);
          map.anisotropy = 2;
          map.repeat.set(100, 100);
          map.wrapS = map.wrapT = THREE.RepeatWrapping;
          material.materials[0].bumpMap = map;
          material.materials[0].bumpScale = 0.1;          
          let newObj = new THREE.Mesh(geo, material);
          newObj.name = 'WHEELS';
          obj.add(newObj);
          cb ? cb() : null  
        });
      });
    }

    function loadScrews(obj, cb) {
      loader.load(ASSETS_PATH + skateboard.screws, (geo, mat) => {
        let material = new THREE.MultiMaterial(mat);
        let newObj = new THREE.Mesh(geo, material);
        newObj.name = 'SCREWS';
        obj.add(newObj);
        cb ? cb() : null
      });
    }
  } 

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = 'scene-container';
    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
        ref='main-scene'
      >
      {
        !this.state.loaded ? 
        <div 
          className='scene-loader' 
          style={{
            width: window.innerWidth + 'px',
            height: window.innerWidth * 0.56 + 'px'
          }}
        > 
          <Halogen
            className='ringloader'
            color='#ffffff'
            size={window.innerWidth / 3 + 'px'}
          />
          <p>{'Loading Please Wait'}</p>
        </div>
        : null
      }
      </div>
    )
  }
}

Scene.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string
};

Scene.defaultProps = {
  style: {},
  className: ''
};

export default Scene;