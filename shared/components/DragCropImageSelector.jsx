import React, { PropTypes, Component } from 'react';
import DragCrop from './DragCrop';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

class DragCropImageSelector extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {};

    this.onDrop = this.onDrop.bind(this);
  }
  onDrop(acceptedFiles) {
    const addImage = this.props.onNewImage;
    console.log('blah yo 1', this.props.onNewImage);

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
  renderDropZone() {
    console.log('blah yo 2', this.props.onNewImage);
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
        return this.renderText('Upload Image');
      }}
    </Dropzone>);
  }
  render() {
    if (this.props.url) {
      return (<div>
        <DragCrop
          onImageChange={this.props.onImageChange}
          height={this.props.height}
          width={this.props.width}
          url="/img/cover-images/field-standing.jpg"
        />
      </div>);
    }

    return (<div className="drag-crop-dropzone" style={{ display: 'inline-block', height: `${this.props.height}px`, width: `${this.props.width}px` }}>{this.renderDropZone()}</div>);
  }
}

DragCropImageSelector.propTypes = {
  url: PropTypes.string,
  onImageChange: PropTypes.func,
  onNewImage: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default DragCropImageSelector;
