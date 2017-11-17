import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
// import * as Actions from '../redux/actions/index';
import { getImageUrl, getRandomImageUrl } from '../helpers';

class FilterFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    console.log('blah postcard', props.postcard);

    this.drawCanvas = this.drawCanvas.bind(this);

    const imageObj = new Image();
    imageObj.crossOrigin = 'anonymous';
    imageObj.origin = 'anonymous';
    imageObj.onload = () => { this.drawCanvas(imageObj); };
    imageObj.src = getImageUrl(props.postcard.image);

    this.state = {
      imageObj,
    };
  }
  componentDidMount() {}
  drawCanvas() {
    // https://tympanus.net/codrops/2014/10/30/resizing-cropping-images-canvas/
    // http://jsfiddle.net/m1erickson/gz6e8/
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    const canvas = this.refs['filter-canvas'];
    const ctx = canvas.getContext('2d');
    console.log(ctx);
    const { imageObj } = this.state;
    const { imageCrop } = this.props.postcard;

    ctx.scale = imageCrop.scale;
    ctx.drawImage(
      imageObj,
      imageCrop.naturalWidth,
      imageCrop.naturalHeight,
      // (imageCrop.scale * imageCrop.w),
      // (imageCrop.scale * imageCrop.h),
      // 0,
      // 0,
      // imageCrop.w,
      // imageCrop.h,
    );
  }
  render() {
    return (<div>
      filters
      <canvas ref="filter-canvas" />
    </div>);
  }
}

function mapStateToProps(store) {
  const { postcard } = store;
  if (!postcard.image) {
    postcard.image = { url: getRandomImageUrl() };
  }

  return {
    postcard,
  };
}

FilterFrontImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FilterFrontImageContainer);
