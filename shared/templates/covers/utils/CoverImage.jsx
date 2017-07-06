/* eslint react/prop-types: 0 */

import React, { Component } from 'react';

class CoverImage extends Component {
  constructor(props) { // eslint-disable-line
    super(props);
  }
  imageOuterStyle() {
    const { height, width } = this.props;

    return {
      height: `${height}px`,
      width: `${width}px`,
      overflow: 'hidden',
      position: 'absolute',
      perspective: '1px',
    };
  }
  imageWrapperStyle() {
    const { height, width } = this.props;

    return {
      overflow: 'hidden',
      display: 'inline-block',
      height: `${height}px`,
      width: `${width}px`,
    };
  }
  renderOverlay() {
    return (<div
      className="cover-image-overlay"
      style={{
        position: 'absolute',
        textAlign: 'center',
        background: '#333',
        color: '#f8f8f8',
        opacity: 0,
        transition: 'opacity .25s ease',
        MozTransition: 'opacity .25s ease',
        width: 'inherit',
        height: 'inherit',
        paddingTop: '75px',
      }}
    >
      <style>{coverImageClasses}</style>
      EDIT
    </div>);
  }
  renderImage() {
    const { image, height, width } = this.props;

    const xScaleRatio = width / image.crop.width;
    const yScaleRatio = height / image.crop.width;

    const imageInnerStyles = {
      width: `${image.crop.naturalWidth * xScaleRatio}px`,
      position: 'relative',
      left: `-${image.crop.x * xScaleRatio}px`,
      top: `-${(image.crop.y) * yScaleRatio}px`,
    };

    return (<div style={this.imageOuterStyle()}>
      <img style={imageInnerStyles} src={image.src} role="presentation" />;
    </div>);
  }

  render() {
    // let image = <img style={imageStyles} role="presentation" src={'data:image/png;base64,'} />;

    // if (this.image.content) {
    //   const dataUriPrefix = `data:${this.image.contentType};base64,`;
    //   image = <img style={imageStyles} role="presentation" src={dataUriPrefix + this.image.content} />;

      // if (this.image.crop) {
      //   const crop = this.image.crop;
      //
      //   const outerImageStyles = imageStyles;
      //   outerImageStyles.overflow = 'hidden';
      //   outerImageStyles.position = 'absolute';
      //   outerImageStyles.perspective = '1px';
      //
      //   const xScaleRatio = width / crop.width;
      //   const yScaleRatio = height / crop.width;
      //
      //   const imageInnerStyles = {
      //     width: `${crop.naturalWidth * xScaleRatio}px`,
      //     position: 'relative',
      //     left: `-${crop.x * xScaleRatio}px`,
      //     top: `-${(crop.y) * yScaleRatio}px`,
      //   };
      //
      //   image = <div style={outerImageStyles}><img style={imageInnerStyles} role="presentation" src={dataUriPrefix + this.image.content} /></div>;
      // }
    // }

    return (<div className="cover-image-wrapper" onClick={this.props.selectImage} style={this.imageWrapperStyle()}>
      {this.renderOverlay()}
      {this.renderImage()}
    </div>);
  }
}

const coverImageClasses = `
.cover-image-wrapper:hover {
  cursor: pointer;
}
.cover-image-wrapper:hover .cover-image-overlay {
  opacity: 0.7;

}
.cover-image-overlay:hover {
  z-index: 2;
}
`;

export default CoverImage;