'use strict';
import React, {PropTypes} from 'react';
import { customization } from '../../config/objects.json';

// const deck = customization.deck;

class ColorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorFunctionName: undefined,
      textureFunctionName: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.angle !== nextProps.angle) {
      let colorFunctionName = 'change' + nextProps.angle[0].toUpperCase()
      + nextProps.angle.substring(1, nextProps.angle.length) + 'Color';
      let textureFunctionName = 'change' + nextProps.angle[0].toUpperCase()
      + nextProps.angle.substring(1, nextProps.angle.length) + 'Texture';
      this.setState({
        colorFunctionName,
        textureFunctionName 
      })
    }
  }

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = 'color-select-container';
    let colorFunctionName = this.state.colorFunctionName ||  'change' + this.props.angle[0].toUpperCase()
      + this.props.angle.substring(1, this.props.angle.length) + 'Color';
      let textureFunctionName = this.state.textureFunctionName || 'change' + this.props.angle[0].toUpperCase()
      + this.props.angle.substring(1, this.props.angle.length) + 'Texture'; 
    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
      >
        {
          customization[this.props.angle].colors.map((color, i) => {
            return (
              <div 
                key={i}
                className='select-item color-select'
                style={{
                  backgroundColor: '#' + color.color.split('0x')[1]
                }} 
                onClick={() => this.props[this.state.colorFunctionName || colorFunctionName](color)}
                onTouchStart={() => this.props[this.state.colorFunctionName || colorFunctionName](color)}  
              />
            )
          })
        }
        {
          customization[this.props.angle].textures.map((tex, i) => {
            return (
              <div
                key={i}
                className='select-item texture-select'
                onClick={() => this.props[this.state.textureFunctioName || textureFunctionName](tex)}
                onTouchStart={() => this.props[this.state.textureFunctioName || textureFunctionName](tex)}  
              >
                <div 
                  className='texture-select-image' 
                  style={{
                    backgroundImage: 'url(/assets/textures/' + tex.path + ')',
                  }}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

ColorSelect.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  angle: PropTypes.string
};

ColorSelect.defaultProps = {
  style: {},
  className: ''
};

export default ColorSelect;