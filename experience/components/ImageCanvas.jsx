import React, { PropTypes, Component } from 'react';

class ImageCanvas extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.drawCanvas = this.drawCanvas.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleResizeFinished = this.handleResizeFinished.bind(this);

    //              width / height
    this.aspectRatio = (6 / 4);
    this.state = {
      previewElmWidth: null,
    };
  }
  componentDidMount() {
    this.loadImage();

    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize, true);
    setTimeout(() => { this.handleWindowResize(); }, 100);
    setTimeout(() => { this.handleWindowResize(); }, 100);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, true);
  }
  getPreviewHeight() {
    if (this.state.previewElmWidth) {
      return (1 / this.aspectRatio) * this.state.previewElmWidth;
    }

    return 20;
  }
  handleWindowResize() {
    this.setState({ previewElmWidth: this.refs['measure-width'].offsetWidth });
    clearTimeout(doit);
    const doit = setTimeout(this.handleResizeFinished, 100);
  }
  handleResizeFinished() {
    this.loadImage();
  }
  loadImage() {
    this.img = this.img || new Image();
    this.img.onload = () => { this.drawCanvas(this.img); };
    this.img.src = this.props.imageUrl;
  }
  drawCanvas(img) {
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

    const canvas = this.refs['filter-canvas'];
    const ctx = canvas.getContext('2d');
    const { crop } = this.props;

    console.log('blah hey hi', crop.w * (1 / crop.scale),
    crop.h * (1 / crop.scale));

    ctx.drawImage(
      img,
      crop.x * (1 / crop.scale), // sourceX
      crop.y * (1 / crop.scale), // sourceY
      crop.w * (1 / crop.scale), // sourceWidth
      crop.h * (1 / crop.scale), // sourceHeight
      0, // destX
      0, // destY
      canvas.width, // destWidth
      canvas.height, // destHeight
    );

    this.props.passback(canvas, ctx);
  }
  render() {
    const canvasHeight = this.getPreviewHeight();

    return (<div>
      <div ref="measure-width" />
      <canvas
        className="image-canvas"
        ref="filter-canvas"
        width={this.state.previewElmWidth || 0}
        height={canvasHeight || 0}
      />
    </div>);
  }
}

ImageCanvas.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  crop: PropTypes.object.isRequired,
  passback: PropTypes.func.isRequired,
};

export default ImageCanvas;
