import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Dropzone from 'react-dropzone';
import { renderToString } from 'react-dom/server';

class ImageInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.onDrop = this.onDrop.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
  }
  // onDrop(acceptedFiles, rejectedFiles) {
  onDrop(acceptedFiles) {
    // console.log('Accepted files: ', acceptedFiles);
    // console.log('Rejected files: ', rejectedFiles);

    const setFormState = this.props.setFormState;

    _.forEach(acceptedFiles, (file) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file.preview, true);
      xhr.responseType = 'arraybuffer';

      // xhr.onload = function(e) {
      xhr.onload = function () { // eslint-disable-line func-names
        const image = {
          contentType: file.type,
          fileName: file.name,
          contentDisposition: 'attachment',
          length: file.size,
          content: (new Buffer(this.response)).toString('base64'),
        };

        setFormState(undefined, { image }, true);
      };
      xhr.send();
    });
  }
  rotateImage() {
    const newImage = Object.assign({}, this.props.image);
    newImage.rotating = true;
    this.props.setFormState(undefined, { image: newImage });
    this.props.rotateImage();
  }
  renderRotateButton() {
    if (this.props.imageSaved) {
      return (<div
        className="btn btn-primary btn-xs-true"
        onClick={this.rotateImage}
      >
        <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span> Rotate Image
      </div>);
    }
  }
  renderHelperText() {
    if (this.props.imageSaved) {
      return <span>Click on the image to change it.</span>;
    }

    return <span>Click on the placeholder to add an image.</span>;
  }
  render() {
    return (<div>
      <div className="row bottom-bumper">
        <div className="col-sm-8">{this.renderHelperText()}</div>
        <div className="col-sm-4 text-right">
          {this.renderRotateButton()}
        </div>
      </div>
      <Dropzone className="pointer" style={{ height: '100%', width: '100%' }} onDrop={this.onDrop}>
        {this.props.renderImage()}
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
          return 'Drop or click to add image attachment...';
        }}
      </Dropzone>
    </div>);
  }
}

ImageInput.propTypes = {
  renderImage: PropTypes.func.isRequired,
  setFormState: PropTypes.func.isRequired,
  rotateImage: PropTypes.func.isRequired,
  image: PropTypes.func.isRequired,
  imageSaved: PropTypes.bool.isRequired,
};

class FullImagePageTemplate {
  constructor(page, content) {
    this.page = page;

    this.defaultContent = {
      image: {
        url: 'http://via.placeholder.com/800x600',
      },
      header: 'Header Text - Delete this text if you want more room for a picture',
    };

    this.content = content || this.page.content || this.defaultContent;
    this.renderImage = this.renderImage.bind(this);
  }
  initialFormState() {
    return this.content;
  }
  renderImage() {
    const image = this.content.image;

    let spinner = null;
    if (image.rotating) {
      spinner = (<div className="spinner">Rotating...</div>);
    }

    let src = '';
    if (image.url) {
      src = `${image.url}?t=${image.updatedAt}`;
    } else if (image.content && ['image/jpeg', 'image/png'].indexOf(image.contentType) > -1) {
      const dataUriPrefix = `data:${image.contentType};base64,`;
      src = dataUriPrefix + image.content;
    }

    return (<div
      className="image-wrapper"
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img style={{ height: '100%', width: '100%', display: 'block' }} role="presentation" src={src} />
      {spinner}
    </div>);
  }
  renderHeader(header) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '10px',
    };

    if (_.isEmpty(this.content.header)) { return null; }

    return <div style={divStyle}>{header || this.content.header}</div>;
  }
  render() {
    return (<div>
      {this.renderHeader()}
      {this.renderImage()}
    </div>);
  }
  renderForm(setFormState, rotateImage) {
    this.setFormState = setFormState;
    const headerInput = <div className="editable" name="header" contentEditable onBlur={setFormState}>{this.content.header}</div>;

    return (<div>
      {this.renderHeader(headerInput)}
      <ImageInput setFormState={setFormState} renderImage={this.renderImage} rotateImage={rotateImage} image={this.content.image} imageSaved={!!(_.get(this.page, 'content.image.url'))} />
    </div>);
  }

  toString() {
    return `
<html>
  <head>
    <meta charset="utf8">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        box-sizing: border-box;
      }
    </style>
    <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
  </head>
  <body>
  ${renderToString(this.render())}
  </body>
</html>
    `;
  }
}

export default FullImagePageTemplate;
