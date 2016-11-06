'use strict';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { skateboard, viewPoints, transitionViews } from '../../config/objects.json';
import ArcSolver from 'threejs-arc-solver';

// const glslify = require('glslify');
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
    this.arcSamples = [];
    this.arcTime = SPLINE_SPEED;
    this.origin = new THREE.Vector3(0, 0, 0);
  }

  componentWillMount() {

  }

  componentDidMount() {
    let domElement = ReactDOM.findDOMNode(this.refs['main-scene']);
    this.initScene(domElement, () => {

    });
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.angle !== this.props.angle) {
      this.cameraRailTo(nextProps.angle);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  }

  cameraRailTo(angle) {
    this.arcSamples = [];
    this.arcTime = 0;
    let initialPoint = this.camera.position;
    let endPoint;
    switch(angle) {
      case 'wheels':
        endPoint = viewPoints['wheel-customization'].pos;
        break;
      case 'deck':
        endPoint = viewPoints['deck-customization'].pos;  
        break;
      case 'wood':
        endPoint = viewPoints['wood-customization'].pos;
        break;
      default:
        return;
    }
    endPoint = new THREE.Vector3(
      endPoint[0], endPoint[1], endPoint[2]
    );
    let centrePoint = midPoint(initialPoint, endPoint);
    //let arc = new ArcSolver(initialPoint, centrePoint, endPoint);
    let curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = initialPoint;
    curve.v1 = centrePoint;
    curve.v2 = endPoint;
    for(var i = 0; i < SPLINE_SPEED; i++) {
      let s = curve.getPoint(i/SPLINE_SPEED);
      this.arcSamples.push([s.x, s.y, s.z]);
    }
    

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
        type: 'orbit'
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
    light.lookAt(new THREE.Vector3(0,0,0));

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
    }

    this.initMainObject(scene, (obj) => {
      this.scene.add(obj);
      this.props.updateMaterialsLibrary({
        deck: obj.children.filter((d) => d.name === 'DECK')[0].material,
        wheels: obj.children.filter((d) => d.name === 'WHEELS')[0].material,
        screws: obj.children.filter((d) => d.name === 'SCREWS')[0].material
      })
      

      createLoop((dt) => {
        this.animateArc();
        updateControls();
        renderer.render(this.scene, this.camera);
      }).start();  

      cb ? cb() : null;
    });
  }


  animateArc() {
    if(this.arcTime >= SPLINE_SPEED) return;
    this.camera.position.fromArray(this.arcSamples[this.arcTime++]);
    this.controls.position = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];

    //this.camera.lookAt(this.origin);
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
        let material = new THREE.MultiMaterial(mat);
        let newObj = new THREE.Mesh(geo, material);
        newObj.name = 'WHEELS';
        obj.add(newObj);
        cb ? cb() : null
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
      />
    )
  }
}

Scene.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  view: PropTypes.string
};

Scene.defaultProps = {
  style: {},
  className: '',
  view: 'deck1'
};

export default Scene;