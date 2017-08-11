/* eslint react/prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */
/* eslint no-useless-constructor: 0 */

import React, { Component } from 'react';

class SpineCoverBase extends Component {
  constructor(props) {
    super(props);
  }
  spineOuterStyle() {
    return {
      display: 'inline-block',
      verticalAlign: 'top',
      width: this.props.spineWidth,
      height: this.props.fullHeight,
      fontSize: '20px',
      backgroundColor: this.props.outerBackgroundColor,
      fontFamily: this.props[this.props.spineFont].family,
    };
  }
  spineInnerStyle() {
    return {
      color: this.props.textColor,
      backgroundColor: this.props.backgroundColor,

      transform: 'rotate(90deg)',
      WebkitTransform: 'rotate(90deg)',
      transformOrigin: 'left top 0',
      WebkitTransformOrigin: 'left top 0',

      width: this.props.boardHeight,
      height: this.props.spineWidth,
      position: 'relative',
      left: this.props.spineWidth,
      marginTop: this.props.bleedWidth,
      marginBottom: this.props.bleedWidth,

      lineHeight: this.props.spineWidth,
      textAlign: 'center',
      fontWeight: '100',
    };
  }
  render() {
    return (<div
      className="spine"
      style={{
        ...this.spineOuterStyle(),
      }}
    >
      <div
        style={{
          ...this.spineInnerStyle(),
        }}
      >
        {this.props.children}
      </div>
    </div>);
  }
}

export default SpineCoverBase;
