'use strict';
import React, {PropTypes} from 'react';
import ColorSelect from '../ColorSelect';

class PartViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // component has not been rendered to DOM yet
    // process any data here if needed
  }

  componentDidMount() {
    // component has been rendered to DOM
  }

  componentWillReceiveProps(nextProps) {
    // component has already rendered but will re-render when receives new props
  }

  componentWillUnmount() {
    // component is about to be removed from DOM
    // clean up any event listeners ect. here
  }

  onClickSelector(angle) {
    const { updateAngle } = this.props;
    switch(angle) {
      case 'deck':
        updateAngle('deck');
        break;
      case 'wheels':
        updateAngle('wheels');
        break;
      case 'wood':
        updateAngle('wood');
        break;
      default:
        return;
    }
  }

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = '';

    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
      >
        <div 
          className='deck-button' 
          onClick={() => this.onClickSelector('deck')}
          onTouchStart={() => this.onClickSelector('deck')}
        />
        <div 
          className='wheels-button' 
          onClick={() => this.onClickSelector('wheels')}
          onTouchStart={() => this.onClickSelector('wheels')}
        />
        <div 
          className='wood-button' 
          onClick={() => this.onClickSelector('wood')}
          onTouchStart={() => this.onClickSelector('wood')}
        />
        <ColorSelect 
          changeDeckColor={(c) => this.props.changeDeckColor(c)}
          changeDeckTexture={(t) => this.props.changeDeckTexture(t)}
          changeCasterColor={(c) => this.props.changeCasterColor(c)}
          changeScrewColor={(c) => this.props.changeScrewColor(c)}
          changeAssemblyColor={(c) => this.props.changeAssemblyColor(c)}
          changeAssemblyTexture={(t) => this.props.changeAssemblyTexture(t)}
          changeWood={(w) => this.props.changeWood(w)}
        />
      </div>
    )
  }
}

PartViewer.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string

};

PartViewer.defaultProps = {
  style: {},
  className: ''
};

export default PartViewer;