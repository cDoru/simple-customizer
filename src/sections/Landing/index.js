'use strict';
import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';
import { connect } from 'react-redux';

import { updateMaterialsLibrary } from './actions';

import Scene from '../../components/Scene';

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