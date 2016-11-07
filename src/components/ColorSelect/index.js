'use strict';
import React, {PropTypes} from 'react';
import { customization } from '../../config/objects.json';

const deck = customization.deck;

class ColorSelect extends React.Component {
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

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = 'color-select-container';

    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
      >
        {
          deck.colors.map((color, i) => {
            return (
              <div 
                key={i}
                className='select-item color-select'
                style={{
                  backgroundColor: '#' + color.color.split('0x')[1]
                }} 
                onClick={() => this.props.changeDeckColor(color)}
                onTouchStart={() => this.props.changeDeckColor(color)}  
              />
            )
          })
        }
        {
          deck.textures.map((tex, i) => {
            return (
              <div
                key={i}
                className='select-item texture-select'
                onClick={() => this.props.changeDeckTexture(tex)}
                onTouchStart={() => this.props.changeDeckTexture(tex)}  
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