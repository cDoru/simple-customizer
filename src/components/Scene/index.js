'use strict';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { skateboard } from '../../config/objects.json';

const THREE = require('three');
const glslify = require('glslify');
const path = require('path');
const createLoop = require('raf-loop');
const createScene = require('scene-template');
const loader = new THREE.JSONLoader();

const CLEAR_COLOR = 0xffffff;
const ASSETS_PATH = '/assets/';

class Scene extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // component has not been rendered to DOM yet
    // process any data here if needed
  }

  componentDidMount() {
    let domElement = ReactDOM.findDOMNode(this.refs['main-scene']);
    this.initScene(domElement);
  }

  componentWillReceiveProps(nextProps) {
    // component has already rendered but will re-render when receives new props
  }

  componentWillUnmount() {
    // component is about to be removed from DOM
    // clean up any event listeners ect. here
  }

  initScene(el) {
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    const light = new THREE.SpotLight(0xffffff);
    light.intensity = 1;
    ambient.intensity = 1;
    const opts = {
      renderer: {
        antialias: true,
      },
      controls: {
        theta: 0 * Math.PI / 180,
        phi: -55 * Math.PI / 180,
        distance: 40,
        type: 'orbit'
      },
      camera: {
        far: 100000
      },
      domElement: el, 
      object: [
        // ambient,
        // light
      ]
    };

    let { 
      renderer,
      camera,
      scene,
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
      updateControls 
    });
    window.scene = this.scene;
    
    this.initMainObject(scene, (obj) => {
      this.scene.add(obj);
      createLoop((dt) => {
        updateControls();
        renderer.render(this.scene, this.camera);
      }).start();  
    });
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
        // mat[0].map = ASSETS_PATH + 'textures/tex_03.png';
        let material = new THREE.MultiMaterial(mat);
        let newObj = new THREE.Mesh(geo, material);
        obj.add(newObj);
        cb ? cb() : null
      });
    }
    function loadWheels(obj, cb) {
      loader.load(ASSETS_PATH + skateboard.wheels, (geo, mat) => {
        let material = new THREE.MultiMaterial(mat);
        let newObj = new THREE.Mesh(geo, material);
        obj.add(newObj);
        cb ? cb() : null
      });
    }
    function loadScrews(obj, cb) {
      loader.load(ASSETS_PATH + skateboard.screws, (geo, mat) => {
        let material = new THREE.MultiMaterial(mat);
        let newObj = new THREE.Mesh(geo, material);
        obj.add(newObj);
        cb ? cb() : null
      });
    }
  } 

  

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = '';

    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
        ref='main-scene'
      >
        
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