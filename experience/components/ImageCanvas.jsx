import React, { PropTypes, Component } from 'react';
import { getImageUrl } from '../helpers';

class ImageCanvas extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.drawCanvas = this.drawCanvas.bind(this);
    this.loadImage = this.loadImage.bind(this);
  }
  componentDidMount() {
    this.loadImage();
  }
  loadImage() {
    const img = new Image();
    img.onload = () => { this.drawCanvas(img); };
    img.src = this.props.imageUrl;
  }
  drawCanvas(img) {
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    const canvas = this.refs['filter-canvas'];
    const ctx = canvas.getContext('2d');
    const { crop } = this.props;

    // ctx.drawImage(
    //   img,
    //   crop.x * (1 / crop.scale), // sourceX
    //   crop.y * (1 / crop.scale), // sourceY
    //   crop.naturalWidth, // sourceWidth
    //   crop.naturalHeight, // sourceHeight
    //   0, // destX
    //   0, // destY
    //   canvas.width, // destWidth
    //   canvas.height, // destHeight
    // );

    const sourceX = crop.x * (1 / crop.scale);
    const sourceY = crop.y * (1 / crop.scale);
    const sourceWidth = crop.w * (1 / crop.scale);
    const sourceHeight = crop.h * (1 / crop.scale);
    const destX = 0;
    const destY = 0;
    const destWidth = canvas.width;
    const destHeight = canvas.height;

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
  }
  render() {
    return (<canvas
      className="image-canvas"
      ref="filter-canvas"
      width="842"
      height="561"
    />);
  }
}

ImageCanvas.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  crop: PropTypes.object.isRequired,
};

export default ImageCanvas;
