import React, { PropTypes, Component } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import Modal from '../components/Modal';
import Dropzone from 'react-dropzone';
import Loading from '../components/Loading';
import _ from 'lodash';

class ImageDropzone extends Component {
  constructor(props, context) {
    super(props, context);

    this.onDrop = this.onDrop.bind(this);
  }
  // onDrop(acceptedFiles, rejectedFiles) {
  onDrop(acceptedFiles) {
    const addImage = this.props.addImage;

    _.forEach(acceptedFiles, (file) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file.preview, true);
      xhr.responseType = 'arraybuffer';

      // xhr.onload = function(e) {
      xhr.onload = function () { // eslint-disable-line func-names
        const image = {
          contentType: file.type,
          fileName: file.name,
          length: file.size,
          content: (new Buffer(this.response)).toString('base64'),
        };

        addImage(image);
      };
      xhr.send();
    });
  }
  renderText(text) {
    return <div className="middle-text">{text}</div>;
  }
  render() {
    return (<Dropzone className="image-dropzone" activeClassName="active-image-dropzone" onDrop={this.onDrop}>
      {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => { // eslint-disable-line
        if (isDragActive) {
          return this.renderText('This file is authorized');
        }
        if (isDragReject) {
          return this.renderText('This file is not authorized');
        }
        if (rejectedFiles.length) {
          return this.renderText('File rejected. Please try again.');
        }
        return this.renderText(this.props.text || '+ Image');
      }}
    </Dropzone>);
  }
}

ImageDropzone.propTypes = {
  addImage: PropTypes.func.isRequired,
  text: PropTypes.string,
};

class ImageSelector extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      naturalHeight: undefined,
      naturalWidth: undefined,
      pixelCrop: undefined,
      crop: {
        width: undefined,
        aspect: props.coverProps.aspect || 1,
      },
      imageRef: undefined,
    };

    this.addImage = this.addImage.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.handleCropChange = this.handleCropChange.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleThumbClick = this.handleThumbClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.renderModalFixedFooter = this.renderModalFixedFooter.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.state.image) && _.get(nextProps, 'coverProps.image')) {
      const image = nextProps.coverProps.image;
      const crop = image.displayCrop;
      const pixelCrop = image.pixelCrop;

      this.setState({ crop, pixelCrop, image });
    } else if (nextProps.coverProps.aspect !== this.state.crop.aspect) {
    // if (nextProps.coverProps.aspect !== this.state.crop.aspect) {
      this.setState({ crop: { ...this.state.crop, aspect: nextProps.coverProps.aspect } });
    }
  }
  componentWillUnmount() {
    this.setState({ image: undefined });
  }
  addImage(image) {
    this.props.upload(image);
  }
  submitImage() {
    const crop = this.state.pixelCrop || {};
    crop.naturalHeight = this.state.naturalHeight;
    crop.naturalWidth = this.state.naturalWidth;
    crop.relativeHeight = this.state.relativeHeight;
    crop.relativeWidth = this.state.relativeWidth;
    crop.width = crop.width || Math.round(crop.relativeWidth * (this.state.crop.width / 100));
    // crop.height = Math.round(crop.naturalHeight * (this.state.crop.height / 100));

    // Renaming things here since the pixelCrop is what I use I changed the name to crop
    // And the crop property is now display crop

    const imageData = {
      imageId: this.state.image._id,
      selectedAt: (new Date()).getTime(),
      crop,
      displayCrop: this.state.crop,
    };

    const metaData = {};
    metaData[this.props.coverProps.key] = imageData;

    this.props.submit(metaData);
  }
  handleImageLoad(image) {
    // Original
    const newState = {
      crop: makeAspectCrop({
        x: this.state.crop.x || 0,
        y: this.state.crop.y || 0,
        aspect: this.props.coverProps.aspect || 1,
        width: this.state.crop.width || 30,
      }, image.naturalWidth / image.naturalHeight),
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      relativeHeight: image.height,
      relativeWidth: image.width,
      imageRef: image,
    };

    this.setState(newState);

    // this.setState({ naturalHeight: target.naturalHeight, naturalWidth: target.naturalWidth });
  }
  handleCropChange(crop, pixelCrop) {
    this.setState({ crop, pixelCrop });
  }
  handleThumbClick(image) {
    this.setState({ image });
  }
  handleClose() {
    this.setState({ image: undefined });
    this.props.close();
  }
  renderImage() {
    if (!_.isEmpty(this.state.image)) {
      const image = this.state.image;

      const divStyle = {
        width: '100%',
        marginTop: '5px',
      };

      return (<div className="image-selector-crop-wrapper">
        <ReactCrop
          onImageLoaded={this.handleImageLoad}
          style={divStyle}
          crop={this.state.crop}
          keepSelection
          onChange={this.handleCropChange}
          onComplete={this.handleCropChange}
          src={image.url}
        />
      </div>);
    }
  }
  renderActions() {
    return (<div className="text-right">
      <span className="btn btn-danger" onClick={this.handleClose}>Back</span>
      <span className="btn btn-success marginless-right" onClick={this.submitImage}>Submit</span>
    </div>);
  }
  renderImageThumb(image) {
    if (image.uploading) {
      return <div className="loading"><Loading /></div>;
    } else if (image.content) {
      const dataUriPrefix = `data:${image.contentType};base64,`;
      return <img role="presentation" src={dataUriPrefix + image.content} />;
    }

    return <img role="presentation" src={image.url} />;
  }
  renderImageThumbs() {
    return _.map(this.props.images, (image, id) => {
      return (<div key={id} className={`selector-image-thumb ${image._id === _.get(this.state, 'image._id') ? 'active' : ''}`} onClick={() => { this.handleThumbClick(image); }}>
        {this.renderImageThumb(image)}
      </div>);
    });
  }
  renderModalFixedFooter() {
    return (<div className="row">
      {this.renderActions()}
    </div>);
  }
  renderSelector() {
    return (<div className="select">
      <ImageDropzone addImage={this.addImage} />
      {this.renderImageThumbs()}
    </div>);
  }
  renderMain() {
    return (<div className="main">
      {this.renderImage()}
    </div>);
  }
  renderHeader() {
    return (<div className="header text-center">
      Select and customize an image for your cover...
    </div>);
  }
  renderWelcome() {
    return (<div className="welcome">
      <ImageDropzone addImage={this.addImage} text="Click or drop here to add an image..." />
    </div>);
  }
  renderBody() {
    if (this.props.images.length > 0) {
      return (<div className="body">
        {this.renderSelector()}
        {this.renderMain()}
      </div>);
    }

    return this.renderWelcome();
  }
  render() {
    if (!this.props.isVisible) {
      return <div></div>;
    }

    return (<div>
      <Modal
        close={this.handleClose}
        renderFixedFooter={this.renderModalFixedFooter}
        showFixedFooter
      >
        <div className="image-selector">
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      </Modal>
    </div>);
  }
}

ImageSelector.propTypes = {
  images: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  coverProps: PropTypes.object.isRequired,
};

export default ImageSelector;
