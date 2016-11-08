'use strict';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import gsap from 'gsap';

class Hamburger extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.props.toggleHamburger(!this.props.hamburger);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.hamburger !== this.props.hamburger) {
      let item = ReactDOM.findDOMNode(this.refs.hamburger);
      let rotate = !this.props.hamburger ? '180deg' : '0deg'
      console.log(rotate);
      gsap.to(item, 0.5, {css: {
          transform: 'rotateY(' + rotate + ')'
        }
      });  
    }    
  }

  render() {
    const style = Object.assign({}, {}, this.props.style);
    const className = 'hamburger';

    return (
      <div
        ref='hamburger'
        className={`${className} ${this.props.className}`}
        style={style}
        onClick={() => this.handleClick()}
        onTouchStart={() => this.handleClick()}
      />
    )
  }
}

Hamburger.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string

};

Hamburger.defaultProps = {
  style: {},
  className: ''
};

export default Hamburger;