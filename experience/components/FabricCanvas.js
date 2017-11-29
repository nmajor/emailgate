import React, { PropTypes, Component } from 'react';

class FabricCanvas extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.loadImage = this.loadImage.bind(this);
    this.loadFabric = this.loadFabric.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleResizeFinished = this.handleResizeFinished.bind(this);
    this.handleObjectModified = this.handleObjectModified.bind(this);
    this.addText = this.addText.bind(this);

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
    if (width !== this.state.width) {
      this.setState({
        width,
        height: this.getHeight(width),
      });
    }
    clearTimeout(doit);
    const doit = setTimeout(this.handleResizeFinished, 100);
  }
  handleResizeFinished() {
    this.loadFabric();
  }
  handleObjectModified() {
    const fabricData = this.fCanvas.toJSON();
    fabricData.backgroundImage.src = undefined;
    this.props.onChange(fabricData);
  }
  addText() {
    const text = new fabric.Text('hello world 2', { // eslint-disable-line no-undef
      left: 100,
      top: 100,
      fontFamily: 'Impact',
      stroke: '#fff',
      strokeWidth: 1,
    });
    console.log('blah hi hhh', text.toJSON());
    this.fCanvas.add(text);
  }
  loadImage() {
    this.image = this.image || new Image();
    this.image.onload = this.loadFabric;
    this.image.src = this.props.backgroundUrl;
  }
  loadFabric() {
    this.fCanvas = new fabric.Canvas('stamp-front-image-canvas'); // eslint-disable-line no-undef
    this.fCanvas.on('object:modified', this.handleObjectModified);

    if (this.props.initialData) {
      console.log('blah hi ho 1', this.props.initialData);
      this.props.initialData.backgroundImage.src = this.props.initialData.backgroundImage.src || this.props.backgroundUrl;
      this.fCanvas.loadFromJSON(
        this.props.initialData,
        this.fCanvas.renderAll.bind(this.fCanvas)
      );
    } else {
      console.log('blah hi ho 2');
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
      // const text2 = new fabric.Text('hello doggie', { // eslint-disable-line no-undef
      //   left: 200,
      //   top: 200,
      //   fontFamily: 'Impact',
      //   stroke: '#fff',
      //   strokeWidth: 1,
      // });
      // this.fCanvas.add(text2);
    }
  }
  experiment() {
    this.addText();
  }
  render() {
    return (<div>
      <div ref="measure-width" />
      <div style={{ width: this.state.width, height: this.state.height }}>
        <canvas id="stamp-front-image-canvas" />
      </div>
      <div onClick={this.experiment} className="btn btn-default">click</div>
      <div onClick={() => { this.props.onSubmit(this.fCanvas.toDataURL()); }} className="btn btn-default">submit</div>
    </div>);
  }
}

FabricCanvas.propTypes = {
  backgroundUrl: PropTypes.string.isRequired,
  initialData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FabricCanvas;
