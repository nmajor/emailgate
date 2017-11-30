import React, { PropTypes, Component } from 'react';
import shortid from 'shortid';
import _ from 'lodash';
import ReactModal from 'react-modal';

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
  componentWillReceiveProps(nextProps) {
    if (nextProps.backgroundUrl !== this.props.backgroundUrl && this.image && this.image.complete) {
      this.loadFabric();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, true);
    this.props.onSubmit({ url: this.fCanvas.toDataURL() });
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
  handleObjectModified(evt) {
    const modObj = evt.target.toJSON(['id']);
    const objects = this.props.initialData.objects || [];
    const modObjIndex = _.findIndex(objects, { id: modObj.id });

    // fabricData.backgroundImage.src = undefined;
    this.props.onChange({
      objects: [
        ...objects.slice(0, modObjIndex),
        modObj,
        ...objects.slice(modObjIndex + 1),
      ],
    });
  }
  canvasElmId() {
    return 'stamp-front-image-canvas';
  }
  addText() {
    const text = new fabric.Text('hello world 2', { // eslint-disable-line no-undef
      id: shortid.generate(),
      left: 100,
      top: 100,
      fontFamily: 'Impact',
      stroke: '#fff',
      strokeWidth: 1,
    });

    const objects = _.get(this.props, 'initialData.objects') || [];
    this.props.onChange({
      objects: [
        ...objects,
        text.toJSON(['id']),
      ],
    });

    this.fCanvas.add(text);
  }
  loadImage() {
    this.image = this.image || new Image();
    this.image.onload = this.loadFabric;
    this.image.src = this.props.backgroundUrl;
  }
  loadFabric() {
    if (!this.fCanvas) {
      this.fCanvas = new fabric.Canvas(this.canvasElmId()); // eslint-disable-line no-undef
      this.fCanvas.on('object:modified', this.handleObjectModified);

      this.fCanvas.setWidth(this.state.width);
      this.fCanvas.setHeight(this.state.height);
      const fImage = new fabric.Image(this.image, { // eslint-disable-line no-undef
        scaleX: this.state.width / this.image.width,
        scaleY: this.state.height / this.image.height,
      });
      this.fCanvas.setBackgroundImage(fImage);

      fabric.util.enlivenObjects(_.get(this.props, 'initialData.objects') || [], (objects) => { // eslint-disable-line no-undef
        objects.forEach((o) => {
          this.fCanvas.add(o);
        });
        this.fCanvas.renderAll();
      });

      this.fCanvas.renderAll();

      // const text = new fabric.Text('hello world', { // eslint-disable-line no-undef
      //   id: shortid.generate(),
      //   left: 100,
      //   top: 100,
      //   fontFamily: 'Impact',
      //   stroke: '#fff',
      //   strokeWidth: 1,
      // });
      // console.log('blah hi', shortid.generate());
      // this.fCanvas.add(text);

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
    this.setState({ showModal: true });
  }
  renderModal() {
    if (this.state.showModal) {
      return (<ReactModal>
        hi
      </ReactModal>);
    }
  }
  render() {
    return (<div>
      <div ref="measure-width" />
      <div style={{ width: this.state.width, height: this.state.height }}>
        <canvas id={this.canvasElmId()} />
      </div>
      <div onClick={this.experiment} className="btn btn-default">click</div>
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
