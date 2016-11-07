'use strict';
import React, {PropTypes} from 'react';
import ColorSelect from '../ColorSelect';

class PartViewer extends React.Component {
  constructor(props) {
    super(props);
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
      case 'component':
        updateAngle('component');
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
          className='view-button deck-button' 
          onClick={() => this.onClickSelector('deck')}
          onTouchStart={() => this.onClickSelector('deck')}
        />
        <div 
          className='view-button wheels-button' 
          onClick={() => this.onClickSelector('wheels')}
          onTouchStart={() => this.onClickSelector('wheels')}
        />
        <div 
          className='view-button wood-button' 
          onClick={() => this.onClickSelector('wood')}
          onTouchStart={() => this.onClickSelector('wood')}
        />
        <div 
          className='view-button component-button' 
          onClick={() => this.onClickSelector('component')}
          onTouchStart={() => this.onClickSelector('component')}
        />
        <ColorSelect
          angle={this.props.angle} 
          changeDeckColor={(c) => this.props.changeDeckColor(c)}
          changeDeckTexture={(t) => this.props.changeDeckTexture(t)}
          changeWheelsColor={(c) => this.props.changeWheelsColor(c)}
          changeScrewColor={(c) => this.props.changeScrewColor(c)}
          changeComponentColor={(c) => this.props.changeComponentColor(c)}
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