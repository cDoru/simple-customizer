'use strict';
import React from 'react';
import { connect } from 'react-redux';
import Preloader from '../../components/Preloader';
import RotateScreen from '../../components/Rotate';
import {setReady, setProgress} from './actions';
import TransitionGroup from 'react-transition-group-plus';
import detect from '../../util/detect';

global.MOBILE_WIDTH = 500;
global.THREE = require('three');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.state = {
      width: 960,
      height: 570
    };
  }
  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  componentWillMount() {
    window.addEventListener('resize',this.onResize);
    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.onResize);
  }
  getContent() {
    if (this.props.ready) {
      return React.cloneElement(this.props.children, { key: this.props.section, width: this.state.width, height: this.state.height});
    } else {
      return <Preloader 
        onProgress={this.props.onProgress}
        onReady={this.props.onReady}
        assets={this.props.assets}
        width={this.state.width}
        height={this.state.height}
      />
    }
  }
  render() {
    return (
      <div id="app">
        <TransitionGroup id="content" component="div" transitionMode="out-in">
          {this.getContent()}
        </TransitionGroup>
        <RotateScreen width={this.state.width} height={this.state.height} />
      </div>
    )
  }
};

const mapStateToProps = (state, ownProps) => {
  let section = ownProps.location.pathname.split('/').filter(Boolean)[0] || 'landing';
  return {
    progress: state.progress,
    ready: state.ready,
    assets: state.assets,
    section: section
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onProgress: function(val) {
      dispatch(setProgress(val));
    },
    onReady: function(val) {
      dispatch(setReady(val));
    }
  }
};

App.defaultProps = {
  assets: [],
  progress: 0,
  ready: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
