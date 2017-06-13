import React from 'react';
import { renderToString } from 'react-dom/server';
// import Textfit from 'react-textfit';
import patterns from './patterns';
import moment from 'moment';
import fonts from './fonts';
import bleedMap from './bleedMap';

class CaseboundCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;
    this.bleedType = props.bleedType || 'casebound';
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
        <div style={footerStyles}>missionarymemoir.com</div>
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
  renderTitleRows() {
    const lineStyles = {
      lineHeight: '82%',
    };
    return this.compilation.title.split(' ').map((word, index) => {
      // return <Textfit key={index} style={lineStyles} mode="single">{word.toUpperCase()}</Textfit>;
      return <div key={index} style={lineStyles} mode="single">{word.toUpperCase()}</div>;
    });
  }
  renderFrontCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontCoverWidth}${this.unitType}`,
      height: `${this.fullHeight}${this.unitType}`,
      color: this.textColor,
      fontSize: '20px',
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
      <div className="container" style={containerStyles}>
        {this.renderFrontCoverInners()}
      </div>
    </div>);
  }
  renderTitleBox() {
    if (this.compilation.title) {
      const titleBox = {
        border: '3px solid #fff',
        padding: '8px 8px 4px 4px',
      };

      const titleStyles = {
        fontSize: '40px',
        fontWeight: '300',
      };

      return (<div style={titleBox}>
        <div style={titleStyles}>{this.renderTitleRows()}</div>
      </div>);
    }
  }
  renderFrontCoverInners() {
    const titlesWrapperStypes = {
      padding: '60px 70px 0 70px',
      textAlign: 'center',
    };

    const subtitleStyles = {
      fontSize: '16px',
      fontWeight: '100',
      textAlign: 'center',
      marginTop: '5px',
      fontFamily: this.secondaryFont.family,
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

    const prettyStartDate = moment(this.startDate).format('MMM YYYY');
    const prettyEndDate = moment(this.endDate).format('MMM YYYY');

    // const prettyStartDate = moment(this.startDate).format('MMM DD, YYYY');
    // const prettyEndDate = moment(this.endDate).format('MMM DD, YYYY');

    return (<div className="border">
      <div style={titlesWrapperStypes}>
        {this.renderTitleBox()}
      </div>
      <div style={subtitleStyles}>{this.compilation.subtitle}</div>
      <div style={footerStyles}>{prettyStartDate} - {prettyEndDate}</div>
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
}

export default CaseboundCoverTemplate;
