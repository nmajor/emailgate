import React from 'react';
import { renderToString } from 'react-dom/server';
// import Textfit from 'react-textfit';
import patterns from './utils/patterns';
import moment from 'moment';
import fonts from './utils/fonts';
import bleedMap from './utils/bleedMap';
import defaultImage from './utils/defaultImage';

class CaseboundCoverTemplate {
  constructor(props) {
    this.changeImage = props.changeImage; // eslint-disable-line func-names

    this.compilation = props.compilation;
    this.bleedType = props.bleedType || 'casebound';
    this.image = props.image || this.compilation.image || {};
    this.templatePreview = false;
    this.startDate = props.startDate;
    this.endDate = props.endDate;

    this.patterns = patterns;
    this.pattern = this.patterns.arabesque;
    this.backgroundColor = '#222';
    this.textColor = '#fff';

    this.prettyStartDate = moment(this.startDate).format('MMM, YYYY');
    this.prettyEndDate = moment(this.endDate).format('MMM, YYYY');

    this.primaryFont = fonts.alegreya;
    this.secondaryFont = fonts.roboto;

    this.compilation.title = this.compilation.title || '';
    this.compilation.subtitle = this.compilation.subtitle || '';

    // http://www.ingramcontent.com/Documents/CoverBleedDimensions.pdf

    // // In milimeters (mm)
    // this.unitType = 'mm'
    // this.bleedWidth = 16;
    // this.gutterWidth = 13;
    // this.boardWidth = 148;
    // this.boardHeight = 235;
    // this.spineWidth = this.compilation.cover.spineWidth;


    // // In pixels (px)
    // this.unitType = 'px';
    // this.pixelsPerMm = 2.834646;
    // this.bleedWidth = 16 * this.pixelsPerMm;
    // this.gutterWidth = 13 * this.pixelsPerMm;
    // this.boardWidth = 148 * this.pixelsPerMm;
    // this.boardHeight = 235 * this.pixelsPerMm;
    // this.spineWidth = this.compilation.cover.spineWidth * this.pixelsPerMm;

    // In pixels (px)
    this.unitType = 'px';
    this.pixelsPerInch = 72;
    this.bleedWidth = bleedMap[this.bleedType].bleedWidth * this.pixelsPerInch;
    this.gutterWidth = bleedMap[this.bleedType].gutterWidth * this.pixelsPerInch;
    this.boardWidth = 5.818 * this.pixelsPerInch;
    this.boardHeight = 9.25 * this.pixelsPerInch;
    this.spineWidth = this.compilation.cover.spineWidth * this.pixelsPerInch;

    this.backCoverWidth = this.bleedWidth + this.boardWidth + this.gutterWidth;
    this.frontCoverWidth = this.gutterWidth + this.boardWidth + this.bleedWidth;

    this.fullWidth = this.frontCoverWidth + this.spineWidth + this.frontCoverWidth;
    this.fullHeight = this.bleedWidth + this.boardHeight + this.bleedWidth;

    console.log('blah', this.fullHeight);
  }
  getCoverDimentions() {
    return { width: this.fullWidth, height: this.fullHeight };
  }
  renderBackCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.backCoverWidth}${this.unitType}`,
      height: `${this.fullHeight}${this.unitType}`,
      fontSize: '14px',
      fontFamily: this.secondaryFont.family,
      backgroundColor: this.backgroundColor,
    };

    const innerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}${this.unitType} ${this.gutterWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType}`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}${this.unitType}`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}${this.unitType}`,
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'center',
      bottom: 0,
      marginBottom: '60px',
      width: '100%',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // innerStyles.backgroundImage = `url(${this.pattern})`;
      innerStyles.backgroundColor = this.backgroundColor;
    }

    return (<div style={styles}>
      <div style={innerStyles}>
        <div style={footerStyles}>myemailbook.com</div>
      </div>
    </div>);
  }
  renderSpine() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.spineWidth}${this.unitType}`,
      height: `${this.fullHeight}${this.unitType}`,
      fontSize: '20px',
      fontFamily: this.secondaryFont.family,
    };

    const textWrapper = {
      transform: 'rotate(90deg)',
      WebkitTransform: 'rotate(90deg)',
      transformOrigin: 'left top 0',
      WebkitTransformOrigin: 'left top 0',
      width: `${this.fullHeight}${this.unitType}`,
      height: `${this.spineWidth}${this.unitType}`,
      lineHeight: `${this.spineWidth}${this.unitType}`,
      position: 'relative',
      left: `${this.spineWidth}${this.unitType}`,
      textAlign: 'center',
    };

    const dateStyle = {
      fontSize: '14px',
      fontWeight: '100',
    };

    return (<div style={styles}>
      <div style={textWrapper}>{this.compilation.title} &middot; <span style={dateStyle}>{this.prettyStartDate} - {this.prettyEndDate}</span></div>
    </div>);
  }
  // renderTitleRows() {
  //   const lineStyles = {
  //     lineHeight: '82%',
  //   };
  //   return this.compilation.title.split(' ').map((word, index) => {
  //     // return <Textfit key={index} style={lineStyles} mode="single">{word.toUpperCase()}</Textfit>;
  //     return <div key={index} style={lineStyles} mode="single">{word.toUpperCase()}</div>;
  //   });
  // }
  renderFrontCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontCoverWidth}${this.unitType}`,
      height: `${this.fullHeight}${this.unitType}`,
      color: this.textColor,
      fontSize: '20px',
      backgroundColor: this.backgroundColor,
      // lineHeight: '55px',
    };

    const containerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.gutterWidth}${this.unitType}`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}${this.unitType}`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}${this.unitType}`,
      padding: '0',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // containerStyles.backgroundImage = `url(${this.pattern})`;
      containerStyles.backgroundColor = this.backgroundColor;
    }

    return (<div className="wrapper" style={styles}>
      <style>
        {this.renderClassStyles()}
      </style>
      <div className="container" style={containerStyles}>
        {this.renderFrontCoverInners()}
      </div>
    </div>);
  }
  renderCoverImage() {
    const imageSize = 180;
    let imageStyles = {
      height: `${imageSize}px`,
      width: `${imageSize}px`,
      borderTopLeftRadius: '50% 50%',
      borderTopRightRadius: '50% 50%',
      borderBottomRightRadius: '50% 50%',
      borderBottomLeftRadius: '50% 50%',
      border: '1px solid #444',
    };

    let imageWrapperStyles = {
      overflow: 'hidden',
      display: 'inline-block',
      height: `${imageSize}px`,
      width: `${imageSize}px`,
    };

    let image = <img style={imageStyles} role="presentation" src={`data:image/png;base64,${defaultImage}`} />;

    if (this.image.content) {
      const dataUriPrefix = `data:${this.image.contentType};base64,`;
      image = <img style={imageStyles} role="presentation" src={dataUriPrefix + this.image.content} />;

      if (this.image.crop) {
        const crop = this.image.crop;

        const outerImageStyles = imageStyles;
        outerImageStyles.overflow = 'hidden';
        outerImageStyles.position = 'absolute';
        outerImageStyles.perspective = '1px';

        const scaleRatio = imageSize / crop.width;

        const imageInnerStyles = {
          width: `${crop.naturalWidth * scaleRatio}px`,
          position: 'relative',
          left: `-${crop.x * scaleRatio}px`,
          top: `-${(crop.y) * scaleRatio}px`,
        };

        image = <div style={outerImageStyles}><img style={imageInnerStyles} role="presentation" src={dataUriPrefix + this.image.content} /></div>;
      }
    }

    return (<div className="cover-image-wrapper" onClick={this.changeImage} style={imageWrapperStyles}>
      {this.changeImage ? <div className="cover-image-overlay">EDIT</div> : null}
      {image}
    </div>);
  }
  renderSubtitle() {
    const subtitleStyles = {
      fontSize: '16px',
      fontWeight: '100',
      textAlign: 'center',
      marginTop: '5px',
      fontFamily: this.secondaryFont.family,
    };

    if (this.compilation.subtitle) {
      return (<div>
        <div style={{ borderBottom: '1px solid #fff', margin: '0 80px' }}></div>
        <div style={subtitleStyles}>{this.compilation.subtitle}</div>
      </div>);
    }
  }
  renderFrontCoverInners() {
    const titlesWrapperStyles = {
      padding: '15px 15px 0 15px',
      textAlign: 'center',
    };

    const titleStyles = {
      fontSize: '30px',
      textAlign: 'center',
      fontWeight: '300',
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'center',
      bottom: 0,
      marginBottom: '60px',
      width: '100%',
      lineHeight: 'initial',
      fontSize: '16px',
      fontFamily: this.secondaryFont.family,
      fontWeight: '100',
    };

    const imageWrapperStyles = {
      textAlign: 'center',
      marginTop: '50px',
    };

    return (<div className="border">
      <div style={imageWrapperStyles}>
        {this.renderCoverImage()}
      </div>
      <div style={titlesWrapperStyles}>
        <div style={titleStyles}>{this.compilation.title}</div>
        {this.renderSubtitle()}
      </div>
      <div style={footerStyles}>{this.prettyStartDate} - {this.prettyEndDate}</div>
    </div>);
  }
  renderClassStyles() {
    return `
      .cover-image-wrapper {
        &:hover {
          cursor: pointer;
        }
      }
      .cover-image-wrapper:hover .cover-image-overlay {
        opacity: 0.7;

      }
      .cover-image-overlay {
        position: absolute;
        text-align: center;
        background: #333;
        color: #f8f8f8;
        opacity: 0;
        transition: opacity .25s ease;
        -moz-transition: opacity .25s ease;
        width: inherit;
        height: inherit;
        padding-top: 75px;
        border-top-left-radius: 50% 50%;
        border-top-right-radius: 50% 50%;
        border-bottom-right-radius: 50% 50%;
        border-bottom-left-radius: 50% 50%;

        &:hover {
          z-index: 2;
        }
      }
      .cover-image-overlay:hover {
        z-index: 2;
      }
    `;
  }
  render() {
    const mainStyles = {
      backgroundColor: this.backgroundColor,
      color: this.textColor,
      fontSize: '20px',
      letterSpacing: '0.5px',
      fontFamily: this.primaryFont.family,
      fontWeight: '100',
    };

    const classes = `
.casebound {
  width: ${this.fullWidth}${this.unitType};
  height: ${this.fullHeight}${this.unitType};
  background-color: ${this.backgroundColor};
}
`;

    return (<div className="casebound" style={mainStyles}>
      <style>{classes}</style>
      {this.renderBackCover()}
      {this.renderSpine()}
      {this.renderFrontCover()}
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
    ${this.primaryFont.link}
    ${this.primaryFont.link !== this.secondaryFont.link ? this.secondaryFont.link : ''}
  </head>
  <body>
  ${renderToString(this.render())}
  </body>
</html>
    `;
  }
  frontCoverToString() {
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
    ${this.primaryFont.link}
    ${this.primaryFont.link !== this.secondaryFont.link ? this.secondaryFont.link : ''}
  </head>
  <body>
  ${renderToString(this.renderFrontCover())}
  </body>
</html>
    `;
  }
}

export default CaseboundCoverTemplate;
