import React, { PropTypes, Component } from 'react';

class FabricCanvas extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.loadImage = this.loadImage.bind(this);
    this.loadFabric = this.loadFabric.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleResizeFinished = this.handleResizeFinished.bind(this);

    this.experiment = this.experiment.bind(this);

    //              width / height
    this.aspectRatio = (6 / 4);
    this.state = {
      width: null,
      height: null,
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
  getHeight(width) {
    return (1 / this.aspectRatio) * width;
  }
  handleWindowResize() {
    const width = this.refs['measure-width'].offsetWidth || 400;
    this.setState({
      width,
      height: this.getHeight(width),
    });
    clearTimeout(doit);
    const doit = setTimeout(this.handleResizeFinished, 100);
  }
  handleResizeFinished() {
    this.loadFabric();
  }
  loadImage() {
    this.image = this.image || new Image();
    this.image.onload = this.loadFabric;
    this.image.src = this.props.backgroundUrl;
  }
  loadFabric() {
    this.fCanvas = new fabric.Canvas('stamp-front-image-canvas'); // eslint-disable-line no-undef
    this.fCanvas.setWidth(this.state.width);
    this.fCanvas.setHeight(this.state.height);
    const fImage = new fabric.Image(this.image, { // eslint-disable-line no-undef
      scaleX: this.state.width / this.image.width,
      scaleY: this.state.height / this.image.height,
    });
    this.fCanvas.setBackgroundImage(fImage);
    this.fCanvas.renderAll();
    const text = new fabric.Text('hello world', { // eslint-disable-line no-undef
      left: 100,
      top: 100,
      fontFamily: 'Impact',
      stroke: '#fff',
      strokeWidth: 1,
    });
    this.fCanvas.add(text);
  }
  experiment() {
    console.log('blah hi', this.fCanvas.toJSON());
  }
  render() {
    return (<div>
      <div ref="measure-width" />
      <div style={{ width: this.state.width, height: this.state.height }}>
        <canvas id="stamp-front-image-canvas" />
      </div>
      <div onClick={this.experiment} className="btn btn-default">click</div>
    </div>);
  }
}

FabricCanvas.propTypes = {
  backgroundUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FabricCanvas;
