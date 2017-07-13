import React, { PropTypes, Component } from 'react';
import ReactCrop from 'react-image-crop';
import Modal from '../components/Modal';
import Dropzone from 'react-dropzone';
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
    return (<Dropzone className="image-dropzone selector" activeClassName="active-image-dropzone" onDrop={this.onDrop}>
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
        return this.renderText(<span><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Image</span>);
      }}
    </Dropzone>);
  }
}

ImageDropzone.propTypes = {
  addImage: PropTypes.func.isRequired,
};

class ImageSelector extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      naturalHeight: undefined,
      naturalWidth: undefined,
      crop: {
        width: 30,
        aspect: 1,
      },
      pixelCrop: undefined,
    };

    this.addImage = this.addImage.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.handleCropChange = this.handleCropChange.bind(this);
    this.handlImageLoad = this.handlImageLoad.bind(this);
    this.handleThumbClick = this.handleThumbClick.bind(this);

    this.renderModalFixedFooter = this.renderModalFixedFooter.bind(this);
  }
  getAspect() {
    if (this.props.aspect) {
      return this.props.aspect;
    }

    return 1;
  }
  addImage(image) {
    this.props.upload(image);
  }
  submitImage() {
    const data = this.state.image;
    data.crop = this.state.pixelCrop || {};
    data.crop.naturalHeight = this.state.naturalHeight;
    data.crop.naturalWidth = this.state.naturalWidth;
    data.selectedAt = (new Date()).getTime();

    this.props.submit(data);
  }
  handlImageLoad(evt) {
    this.setState({ naturalHeight: evt.target.naturalHeight, naturalWidth: evt.target.naturalWidth });
  }
  handleCropChange(crop, pixelCrop) {
    this.setState({ crop, pixelCrop });
  }
  handleThumbClick(image) {
    this.setState({ image });
  }
  renderImage() {
    if (!_.isEmpty(this.state.image)) {
      const image = this.state.image;

      const divStyle = {
        width: '100%',
        marginTop: '5px',
      };

      return (<div className="image-selector-crop-wrapper">
        <img role="presentation" style={{ display: 'none' }} src={image.url} onLoad={this.handlImageLoad} />
        <ReactCrop
          style={divStyle}
          crop={this.state.crop}
          keepSelection
          onComplete={this.handleCropChange}
          src={image.url}
        />
      </div>);
    }
  }
  renderActions() {
    return (<div className="text-right">
      <span className="btn btn-danger" onClick={this.props.close}>Back</span>
      <span className="btn btn-success marginless-right" onClick={this.submitImage}>Submit</span>
    </div>);
  }
  renderImageThumb(image) {
    if (image.content) {
      const dataUriPrefix = `data:${image.contentType};base64,`;
      return <img role="presentation" src={dataUriPrefix + image.content} />;
    }

    return <img role="presentation" src={image.url} />;
  }
  renderImageThumbs() {
    return _.map(this.props.images, (image, id) => {
      return (<div key={id} className="selector-image-thumb" onClick={() => { this.handleThumbClick(image); }}>
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
  render() {
    if (!this.props.isVisible) {
      return <div></div>;
    }

    return (<div>
      <Modal
        close={this.props.close}
        renderFixedFooter={this.renderModalFixedFooter}
        showFixedFooter
      >
        <div className="image-selector">
          {this.renderHeader()}
          {this.renderMain()}
          {this.renderSelector()}
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
  aspect: PropTypes.number,
};

export default ImageSelector;
