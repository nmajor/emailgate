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
  render() {
    return (<div>
      <Dropzone className="image-dropzone" activeClassName="active-image-dropzone" onDrop={this.onDrop}>
        {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => { // eslint-disable-line
          if (isDragActive) {
            return 'This file is authorized';
          }
          if (isDragReject) {
            return 'This file is not authorized';
          }
          if (rejectedFiles.length) {
            return 'File rejected. Please try again.';
          }
          return 'Drop or click to add image...';
        }}
      </Dropzone>
    </div>);
  }
}

ImageDropzone.propTypes = {
  addImage: PropTypes.func.isRequired,
};

class ImageSelector extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      image: undefined,
      crop: {
        width: 30,
        aspect: 1,
      },
      pixelCrop: undefined,
    };

    this.addImage = this.addImage.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.handleCropChange = this.handleCropChange.bind(this);
  }
  addImage(image) {
    this.setState({ image });
  }
  submitImage() {
    const data = this.state.image;
    data.crop = this.state.crop;
    data.pixelCrop = this.state.pixelCrop;

    this.props.submit(data);
  }
  handleCropChange(crop, pixelCrop) {
    this.setState({ crop, pixelCrop });
  }
  renderImage() {
    if (!_.isEmpty(this.state.image)) {
      const image = this.state.image;
      const dataUriPrefix = `data:${image.contentType};base64,`;

      const divStyle = {
        width: '100%',
        marginTop: '5px',
      };

      return (<div className="image-selector-crop-wrapper">
        <ReactCrop
          style={divStyle}
          crop={this.state.crop}
          keepSelection
          onComplete={this.handleCropChange}
          src={dataUriPrefix + image.content}
        />
      </div>);
    }
  }
  renderActions() {
    return (<div className="text-right">
      <span className="btn btn-success" onClick={this.submitImage}>Submit</span>
      <span className="btn btn-danger" onClick={this.props.close}>Back</span>
    </div>);
  }
  render() {
    if (!this.props.isVisible) {
      return <div></div>;
    }

    return (<div>
      <Modal close={this.props.close}>
        <div>
          <ImageDropzone addImage={this.addImage} />
          {this.renderImage()}
          {this.renderActions()}
        </div>
      </Modal>
    </div>);
  }
}

ImageSelector.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

export default ImageSelector;
