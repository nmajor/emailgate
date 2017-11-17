import React, { PropTypes, Component } from 'react';
import DragCrop from './DragCrop';
import Dropzone from 'react-dropzone';
// import Loading from './Loading';
import _ from 'lodash';

class DragCropImageSelector extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
    };

    this.onDrop = this.onDrop.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
  }
  onNewImage(props) {
    this.props.onNewImage(props);
  }
  onDrop(acceptedFiles) {
    const addImage = this.onNewImage;

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
    return <div className="change-image">{text}</div>;
  }
  renderDropZone(text) {
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
        return this.renderText(text);
      }}
    </Dropzone>);
  }
  render() {
    const changeImage = <span>Change <i className="fa fa-picture-o" aria-hidden="true"></i></span>;

    if (this.state.loading) {
      return (<div className="" style={{ display: 'inline-block', maxHeight: `${this.props.height}px`, maxWidth: `${this.props.width}px` }}>
        <div className="alone-loading flex-centerize drag-crop-loading">
          Loading...
        </div>
      </div>);
    }

    console.log('blah hey crop selector', this.props.crop);

    if (this.props.url) {
      return (<div>
        {this.renderDropZone(changeImage)}
        <DragCrop
          onImageChange={this.props.onImageChange}
          height={this.props.height}
          width={this.props.width}
          url={this.props.url}
          crop={this.props.crop}
        />
      </div>);
    }

    return (<div className="drag-crop-dropzone" style={{ display: 'inline-block', maxHeight: `${this.props.height}px`, maxWidth: `${this.props.width}px` }}>{this.renderDropZone('Upload Image')}</div>);
  }
}

DragCropImageSelector.propTypes = {
  url: PropTypes.string,
  crop: PropTypes.object,
  onImageChange: PropTypes.func,
  onNewImage: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default DragCropImageSelector;
