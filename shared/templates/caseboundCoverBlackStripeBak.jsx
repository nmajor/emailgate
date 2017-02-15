import React from 'react';
import { renderToString } from 'react-dom/server';
import patterns from './patterns';
import moment from 'moment';

const fonts = {
  abril: {
    link: '<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet">',
    family: '\'Abril Fatface\', cursive',
  },
  montserrat: {
    link: '<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">',
    family: '\'Montserrat\', sans-serif',
  },
};

class CaseboundCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;
    this.templatePreview = true;
    this.startDate = props.startDate;
    this.endDate = props.endDate;

    this.prettyStartDate = moment(this.startDate).format('MMM DD, YYYY');
    this.prettyEndDate = moment(this.endDate).format('MMM DD, YYYY');

    this.patterns = patterns;
    this.pattern = this.patterns.arabesque;
    this.backgroundColor = '#fff';
    this.textColor = '#222';

    this.primaryFont = fonts.abril;
    this.secondaryFont = fonts.abril;

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
    this.bleedWidth = 0.625 * this.pixelsPerInch;
    this.gutterWidth = 0.5 * this.pixelsPerInch;
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
      fontSize: '20px',
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
      right: '52px',
      bottom: 0,
      marginBottom: '60px',
      width: '100%',
      paddingLeft: `${this.gutterWidth}${this.unitType}`,
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // innerStyles.backgroundImage = `url(${this.pattern})`;
      innerStyles.backgroundColor = this.backgroundColor;
      innerStyles.opacity = 0.5;
      innerStyles.zIndex = 1;
    }

    return (<div style={styles}>
      <div style={innerStyles}>
        <div style={footerStyles}>proudly printed by<br />myemailbook.com</div>
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
    };

    const colorWrapOverWidth = 180;
    const textWrapper = {
      opacity: (this.templatePreview ? 0.5 : 1),
      // backgroundColor: '#222',
      // color: '#FFF',
      transform: 'rotate(90deg)',
      WebkitTransform: 'rotate(90deg)',
      transformOrigin: 'left top 0',
      WebkitTransformOrigin: 'left top 0',
      width: `${this.fullHeight}${this.unitType}`,
      height: `${this.spineWidth + colorWrapOverWidth}${this.unitType}`,
      lineHeight: `${this.spineWidth + colorWrapOverWidth}${this.unitType}`,
      position: 'relative',
      left: `${this.spineWidth + (colorWrapOverWidth / 2)}${this.unitType}`,
      textAlign: 'center',
      fontWeight: '100',
    };

    const dateStyle = {
      fontSize: '14px',
      fontWeight: '100',
    };

    return (<div style={styles}>
      <div style={textWrapper}>{this.compilation.title} &middot; <span style={dateStyle}>{this.prettyStartDate} - {this.prettyEndDate}</span></div>
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
    };

    const titlesWrapperStypes = {
      // padding: `${this.boardHeight / 4}${this.unitType} 28px 0 28px`,
      padding: '60px 25px 0 25px',
      textAlign: 'left',
    };

    const titleStyles = {
      fontSize: '30px',
      ght: '300',
      marginBottom: '5px',
    };

    const subtitleStyles = {
      fontSize: '18px',
      fontWeight: '100',
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: '100',
      paddingLeft: '25px',
      bottom: 0,
      marginBottom: '60px',
      width: '100%',
      lineHeight: 'initial',
    };

    const containerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.bleedWidth}${this.unitType} ${this.gutterWidth}${this.unitType}`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}${this.unitType}`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}${this.unitType}`,
      paddingLeft: '54px',
      paddingRight: '0',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      // containerStyles.backgroundImage = `url(${this.pattern})`;
      containerStyles.backgroundColor = this.backgroundColor;
      containerStyles.opacity = 0.5;
    }

    return (<div className="wrapper" style={styles}>
      <div className="container" style={containerStyles}>
        <div style={titlesWrapperStypes}>
          <div style={titleStyles}>{this.compilation.title}</div>
          <div style={subtitleStyles}>{this.compilation.subtitle}</div>
        </div>
        <div style={footerStyles}>{this.prettyStartDate} - {this.prettyEndDate}</div>
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
