'use strict';
import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';
import { connect } from 'react-redux';

import { updateMaterialsLibrary } from './actions';

import Scene from '../../components/Scene';
import ColorSelect from '../../components/ColorSelect';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'out'
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

  changeDeckColor(color) {
    this.props.materials.deck.materials[1].color = new THREE.Color(parseInt(color));
  }
  //TODO
  changeDeckTexture(texture) {

  }

  changeCasterColor(color) {
    this.props.materials.wheels.materials[2].color = new THREE.Color(parseInt(color));
  }

  changeScrewColor(color) {
    this.props.materials.screws.materials[0].color = new THREE.Color(parseInt(color));
  }

  changeAssemblyColor(color) {
    this.props.materials.wheels.materials[0].color = new THREE.Color(parseInt(color));
  }
  //TODO
  changeAssemblyTexture(texture) {

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

        <Scene 
          updateMaterialsLibrary={this.props.updateMaterialsLibrary}
        />
        <ColorSelect
          changeDeckColor={(c) => this.changeDeckColor(c)}
          changeDeckTexture={(t) => this.changeDeckTexture(t)}
          changeCasterColor={(c) => this.changeCasterColor(c)}
          changeScrewColor={(c) => this.changeScrewColor(c)}
          changeAssemblyColor={(c) => this.changeAssemblyColor(c)}
          changeAssemblyTexture={(t) => this.changeAssemblyTexture(t)}
          changeWood={(w) => this.changeWood(w)}
        />
      </ReactF1>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    materials: state.materials
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMaterialsLibrary: function(val) {
      dispatch(updateMaterialsLibrary(val));
    }
  };
};


Landing.defaultProps = {
  width: 960,
  height: 570
};

// export default Landing;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);