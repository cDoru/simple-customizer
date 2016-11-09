'use strict';
import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';
import { connect } from 'react-redux';
import { updateMaterialsLibrary, updateAngle, toggleHamburger } from './actions';

import Scene from '../../components/Scene';
import ColorSelect from '../../components/ColorSelect';
import PartViewer from '../../components/PartViewer';
import Hamburger from '../../components/Hamburger';
import Footer from '../../components/Footer';

const ASSETS_PATH = '/assets/';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'out',
      dashCopy: {
        copy: 'Part Selector',
        name: 'Select one of the above icons to customize a part'
      }
    };
  }
  componentWillEnter(done) {
    this.setState({
      state: 'idle',
      onComplete: done
    });
  }
  componentWillLeave(done) {
    this.setState({
      state: 'out',
      onComplete: done
    });
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.angle !== nextProps.angle) {
      switch(nextProps.angle) {
        case 'deck':
          this.setState({
            dashCopy: {
              name: 'deck color and style customization',
              copy: "Deck"
            }
          });
          break;
        case 'wheels':
          this.setState({
            dashCopy: {
              name: 'wheel color customization',
              copy: "Wheels"
            }
          });
          break;
        case 'wood':
          this.setState({
            dashCopy: {
              name: 'wood grain',
              copy: "Wood"
            }
          });
          break;
        case 'component':
          this.setState({
            dashCopy: {
              name: 'component customization',
              copy: "Components"
            }
          });
          break;
        default:
          break;
      }
    }
  }

  changeDeckColor(color) {
    this.props.materials.deck.materials[1].color = new THREE.Color(parseInt(color.color));
    this.props.materials.deck.materials[1].map = undefined;
    this.props.materials.deck.materials[1].needsUpdate = true;
    this.setState({
      dashCopy: {
        name: color.name,
        copy: "Deck"
      }
    })
  }
  //TODO
  changeDeckTexture(texture) {
    let map = new THREE.TextureLoader().load(ASSETS_PATH + 'textures/' + texture.path, () => {
      map.anisotropy = 1;
      // map.repeat.set(3, 5);
      map.wrapS = map.wrapT = THREE.RepeatWrapping
      this.props.materials.deck.materials[1] = new THREE.MeshPhongMaterial(Object.assign(
          this.props.materials.deck.materials[1],
          {
            map,
            bumpScale: 0.1,
            color: undefined
          }
        )
      );
      this.props.materials.deck.materials[1].needsUpdate = true;
    });
    this.setState({
      dashCopy: {
        name: texture.name,
        copy: "Deck"
      }
    })
  }

  changeWheelsColor(color) {
    this.props.materials.wheels.materials[2].color = new THREE.Color(parseInt(color.color));
    this.setState({
      dashCopy: {
        name: color.name,
        copy: "Wheels"
      }
    })
  }

  changeScrewColor(color) {
    this.props.materials.screws.materials[0].color = new THREE.Color(parseInt(color.color));
  }

  changeComponentColor(color) {
    this.props.materials.wheels.materials[0].color = new THREE.Color(parseInt(color.color));
    this.setState({
      dashCopy: {
        name: color.name,
        copy: "Components"
      }
    })
  }
  //TODO
  changeWood(wood) {

  }

  render() {
    var style = {width: this.props.width, height: this.props.height};
    return (
      <ReactF1
        go={this.state.state}
        onComplete={this.state.onComplete}
        states={states(this.props)}
        transitions={transitions(this.props)}
        id="Landing"
        data-f1="container"
      > 
        <Hamburger 
          toggleHamburger={this.props.toggleHamburger}
          hamburger={this.props.hamburger}
        />
        {
          window.innerWidth > window.innerHeight ? 
          <Scene 
            updateMaterialsLibrary={this.props.updateMaterialsLibrary}
            angle={this.props.angle}
            toggleHamburger={this.props.toggleHamburger}
            hamburger={this.props.hamburger}
          /> : null
        }
        <PartViewer
          hamburger={this.props.hamburger}
          toggleHamburger={this.props.toggleHamburger}
          updateAngle={this.props.updateAngle}
          angle={this.props.angle}
          changeDeckColor={(c) => this.changeDeckColor(c)}
          changeDeckTexture={(t) => this.changeDeckTexture(t)}
          changeWheelsColor={(c) => this.changeWheelsColor(c)}
          changeScrewColor={(c) => this.changeScrewColor(c)}
          changeComponentColor={(c) => this.changeComponentColor(c)}
          changeWood={(w) => this.changeWood(w)}
          dashCopy={this.state.dashCopy}
        />
        <Footer />
      </ReactF1>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    materials: state.materials,
    angle: state.angle,
    hamburger: state.hamburger
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMaterialsLibrary: function(val) {
      dispatch(updateMaterialsLibrary(val));
    },
    updateAngle: function(val) {
      dispatch(updateAngle(val));
    },
    toggleHamburger: function(val) {
      dispatch(toggleHamburger(val));
    }
  };
};


Landing.defaultProps = {
  width: 960,
  height: 570,
  angle: 'default',
  hamburger: false
};

// export default Landing;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);