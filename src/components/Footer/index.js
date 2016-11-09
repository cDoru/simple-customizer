'use strict';
import React, {PropTypes} from 'react';

class Footer extends React.Component {
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
    const className = 'footer-container';

    return (
      <div
        className={`${className} ${this.props.className}`}
        style={style}
      / >
    )
  }
}

Footer.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string

};

Footer.defaultProps = {
  style: {},
  className: ''
};

export default Footer;