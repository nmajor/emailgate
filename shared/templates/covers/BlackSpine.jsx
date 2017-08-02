import React from 'react';
import { renderToString } from 'react-dom/server';
import patterns from './utils/patterns';
import moment from 'moment';
import fonts from './utils/fonts';
import bleedMap from './utils/bleedMap';
import _ from 'lodash';

class CaseboundCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;
    this.bleedType = props.bleedType || 'casebound';
    this.templatePreview = false;
    this.startDate = _.get(props.compilation, 'meta.startingDate');
    this.endDate = _.get(props.compilation, 'meta.endingDate');

    this.prettyStartDate = moment(this.startDate).format('MMM YYYY');
    this.prettyEndDate = moment(this.endDate).format('MMM YYYY');

    this.patterns = patterns;
    this.pattern = this.patterns.arabesque;
    this.backgroundColor = '#faf0e6';
    this.textColor = '#222';

    this.primaryFont = fonts.abril;
    this.secondaryFont = fonts.raleway;

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

    this.colorWrapOverWidth = this.gutterWidth + 55;
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
      fontSize: '20px',
      position: 'relative',
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
      fontSize: '12px',
      bottom: 0,
      marginBottom: '60px',
      width: '100%',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // innerStyles.backgroundImage = `url(${this.pattern})`;
      innerStyles.backgroundColor = this.backgroundColor;
      innerStyles.opacity = 0.5;
    }
    const logoStyles = {
      fontFamily: this.primaryFont.family,
    };

    // const descStyles = {
    //   fontFamily: this.secondaryFont.family,
    // };

    return (<div style={styles}>
      <div
        style={{
          height: `${this.fullHeight}${this.unitType}`,
          width: `${this.colorWrapOverWidth + 2}${this.unitType}`,
          position: 'absolute',
          right: -2,
          backgroundColor: '#222',
        }}
      ></div>
      <div style={innerStyles}>
        <div style={footerStyles}><div style={logoStyles}>missionarymemoir.com</div></div>
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
      backgroundColor: '#222',
    };

    const textWrapper = {
      backgroundColor: '#222',
      color: '#FFF',
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
      fontWeight: '100',
    };

    if (this.templatePreview) {
      styles.backgroundColor = '#aaa';
      // innerStyles.backgroundImage = `url(${this.pattern})`;
      textWrapper.opacity = 0.5;
      textWrapper.zIndex = 1;
    }

    const dateStyle = {
      fontSize: '14px',
      fontWeight: '100',
    };

    let date = '';
    if (this.startDate && this.endDate) {
      date = <span style={dateStyle}>{this.prettyStartDate} - {this.prettyEndDate}</span>;
    }

    return (<div style={styles}>
      <div style={textWrapper}>{this.compilation.title} &middot; {date}</div>
    </div>);
  }
  renderFrontCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontCoverWidth}${this.unitType}`,
      height: `${this.fullHeight}${this.unitType}`,
      color: this.textColor,
      lineHeight: '33px',
      position: 'relative',
      backgroundColor: this.backgroundColor,
    };

    const titlesWrapperStypes = {
      // padding: `${this.boardHeight / 4}${this.unitType} 28px 0 28px`,
      padding: '60px 25px 0 79px',
      textAlign: 'left',
    };

    const titleStyles = {
      fontSize: '30px',
      marginBottom: '5px',
      fontFamily: this.primaryFont.family,
    };

    const subtitleStyles = {
      fontSize: '14px',
      fontWeight: '100',
      fontFamily: this.secondaryFont.family,
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '100',
      paddingLeft: '79px',
      bottom: 0,
      marginBottom: '60px',
      lineHeight: 'initial',
      fontFamily: this.secondaryFont.family,
    };

    const containerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.gutterWidth}${this.unitType}`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}${this.unitType}`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}${this.unitType}`,
      paddingLeft: '0',
      paddingRight: '0',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // containerStyles.backgroundImage = `url(${this.pattern})`;
      containerStyles.backgroundColor = this.backgroundColor;
      containerStyles.opacity = 0.5;
    }

    let date = '';
    if (this.startDate && this.endDate) {
      date = <div style={footerStyles}>{this.prettyStartDate} - {this.prettyEndDate}</div>;
    }

    return (<div className="wrapper" style={styles}>
      <div
        style={{
          height: `${this.fullHeight}${this.unitType}`,
          width: `${this.colorWrapOverWidth + 2}${this.unitType}`,
          position: 'absolute',
          left: -2,
          backgroundColor: '#222',
        }}
      ></div>
      <div className="container" style={containerStyles}>
        <div style={titlesWrapperStypes}>
          <div style={titleStyles}>{this.compilation.title}</div>
          <div style={subtitleStyles}>{this.compilation.subtitle}</div>
        </div>
        {date}
      </div>
    </div>);
  }
  render() {
    const mainStyles = {
      // width: `${this.fullWidth}${this.unitType}`,
      // height: `${this.fullHeight}${this.unitType}`,
      backgroundColor: this.backgroundColor,
      color: this.textColor,
      fontSize: '20px',
      letterSpacing: '0.5px',
      // backgroundImage: `url("${this.pattern}")`,
      fontFamily: this.primaryFont.family,
      fontWeight: '100',
    };

    const classes = `
.casebound {
  width: ${this.fullWidth}${this.unitType};
  height: ${this.fullHeight}${this.unitType};
  background-color: #222222;
}
`;

    return (<div className="casebound" style={mainStyles}>
      <style>{classes}</style>
      {this.renderBackCover()}
      {this.renderSpine()}
      {this.renderFrontCover()}
    </div>);
  }
  renderWrappedFrontCover() { return this.renderFrontCover(); }
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
