import React, { PropTypes, Component } from 'react';
// import Loading from './Loading';
// import _ from 'lodash';

class PostcardBack extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderContentText() {
    return this.props.content.split('\n').map((item, key) => {
      return <span key={key}>{item}<br /></span>;
    });
  }
  render() {
    const postcardFontSize = this.props.height / 40;

    return (<div
      className="postcard-back"
      style={{
        height: `${this.props.height}${this.props.units}`,
        width: `${this.props.width}${this.props.units}`,
      }}
    >
      <div className="safe-area">
        <div className="content-wrapper">
          <div className="content" style={{ fontSize: `${postcardFontSize}px` }}>
            <p>{this.renderContentText()}</p>
          </div>
        </div>
        <div className="no-content-wrapper">
          <div className="logo">
          </div>
          <div className="ink-free">
          </div>
        </div>
      </div>
    </div>);
  }
}

PostcardBack.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default PostcardBack;
