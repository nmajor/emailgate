/* eslint react/prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-useless-constructor: 0 */

import React, { Component } from 'react';

class BackCoverBase extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div
      style={{
        ...this.props.outerBoardBaseStyle,
        backgroundColor: this.props.outerBackgroundColor,
        fontFamily: this.props[this.props.backCoverFont].family,
      }}
    >
      <div
        style={{
          ...this.props.innerBoardBaseStyle,
          marginRight: this.props.gutterWidth,
          marginLeft: this.props.bleedWidth,
          backgroundColor: this.props.backgroundColor,
          color: this.props.textColor,
        }}
      >
        {this.props.children}
      </div>
    </div>);
  }
}
export default BackCoverBase;
