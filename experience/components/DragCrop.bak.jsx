import React, { Component, PropTypes } from 'react';
import Script from 'react-load-script';
import _ from 'lodash';

class DragCrop extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.handleGuillotineDrop = this.handleGuillotineDrop.bind(this);
    this.handleRotateLeftClick = this.handleRotateLeftClick.bind(this);
    this.handleRotateRightClick = this.handleRotateRightClick.bind(this);
    this.handleRotateZoomInClick = this.handleRotateZoomInClick.bind(this);
    this.handleRotateZoomOutClick = this.handleRotateZoomOutClick.bind(this);
    this.handleFitClick = this.handleFitClick.bind(this);

    this.state = {
      picture: null,
      naturalWidth: null,
      naturalHeight: null,
    };
  }
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.loadImage();
    }
  }
  loadImage() {
    const picture = $('#gui-picture'); // eslint-disable-line
    console.log('blah loadImage', picture);
    picture.on('load', () => {
      this.handleImageLoad(picture);
    });

    if (picture[0].complete) {
      this.handleImageLoad(picture);
    }
  }
  handleImageLoad(picture) {
    picture.guillotine({
      width: this.props.width,
      height: this.props.height,
      onChange: this.handleGuillotineDrop,
      init: this.props.crop,
    });

    if (_.isEmpty(this.props.crop)) {
      picture.guillotine('fit');
    }

    this.setState({
      picture,
      naturalWidth: picture.get(0).naturalWidth,
      naturalHeight: picture.get(0).naturalHeight,
    });
  }
  handleGuillotineDrop(data) {
    this.props.onImageChange({
      ...data,
      naturalWidth: this.state.naturalWidth,
      naturalHeight: this.state.naturalHeight,
    });
  }
  handleRotateLeftClick() {
    this.state.picture.guillotine('rotateLeft');
  }
  handleRotateRightClick() {
    this.state.picture.guillotine('rotateRight');
  }
  handleRotateZoomInClick() {
    this.state.picture.guillotine('zoomIn');
  }
  handleRotateZoomOutClick() {
    this.state.picture.guillotine('zoomOut');
  }
  handleFitClick() {
    this.state.picture.guillotine('fit');
  }
  renderControl(icon, handler) {
    return (<span className="control" onClick={handler}><i className={`fa fa-${icon}`} aria-hidden="true"></i></span>);
  }
  render() {
    return (
      <div className="gui-wrapper" style={{ width: '100%' }}>
        <div className="gui-header" style={{ width: '100%' }}>Drag image to reposition</div>
        <div className="gui-parent" style={{ width: '100%' }}>
          <img role="presentation" id="gui-picture" src={this.props.url} />
        </div>
        <div className="gui-controls" style={{ width: '100%' }}>
          {this.renderControl('search-plus', this.handleRotateZoomInClick)}
          {this.renderControl('search-minus', this.handleRotateZoomOutClick)}
          {this.renderControl('expand', this.handleFitClick)}
          {this.renderControl('rotate-right', this.handleRotateRightClick)}
          {this.renderControl('rotate-left', this.handleRotateLeftClick)}
        </div>
      </div>
    );
  }
}

DragCrop.propTypes = {
  url: PropTypes.string,
  crop: PropTypes.object,
  onImageChange: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default DragCrop;
