import React, { PropTypes, Component } from 'react';

class HelperBox extends Component { // eslint-disable-line
  render() {
    const type = this.props.type || 'primary';
    return (<div className={`helper-box alert alert-${type} ${this.props.className}`}>
      {this.props.body}
    </div>);
  }
}

HelperBox.propTypes = {
  className: PropTypes.string,
  body: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default HelperBox;
