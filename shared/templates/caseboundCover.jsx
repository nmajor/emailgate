import React from 'react';
import { renderToString } from 'react-dom/server';
import patterns from './patterns';
import moment from 'moment';

class CaseboundCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;
    this.templatePreview = false;
    this.startDate = props.startDate;
    this.endDate = props.endDate;

    this.patterns = patterns;
    this.pattern = this.patterns.arabesque;
    this.backgroundColor = '#222';
    this.textColor = '#fff';

    // http://www.ingramcontent.com/Documents/CoverBleedDimensions.pdf

    // In milimeters (mm)
    this.bleedWidth = 16;
    this.gutterWidth = 13;
    this.boardWidth = 148;
    this.boardHeight = 235;

    this.spineWidth = this.compilation.cover.spineWidth;

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
      width: `${this.backCoverWidth}mm`,
      height: `${this.fullHeight}mm`,
      fontSize: '20px',
    };

    const innerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}mm ${this.gutterWidth}mm ${this.bleedWidth}mm ${this.bleedWidth}mm`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}mm`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}mm`,
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'center',
      bottom: 0,
      marginBottom: `${this.boardHeight / 6}mm`,
      width: '100%',
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
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
      width: `${this.spineWidth}mm`,
      height: `${this.fullHeight}mm`,
      fontSize: '20px',
    };

    const textWrapper = {
      transform: 'rotate(90deg)',
      WebkitTransform: 'rotate(90deg)',
      transformOrigin: 'left top 0',
      WebkitTransformOrigin: 'left top 0',
      width: `${this.fullHeight}mm`,
      height: `${this.spineWidth}mm`,
      lineHeight: `${this.spineWidth}mm`,
      position: 'relative',
      left: `${this.spineWidth}mm`,
      textAlign: 'center',
    };

    return (<div style={styles}>
      <div style={textWrapper}>{this.compilation.title}</div>
    </div>);
  }
  renderFrontCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontCoverWidth}mm`,
      height: `${this.fullHeight}mm`,
      color: '#fff',
      fontSize: '20px',
      lineHeight: '55px',
    };

    const titlesWrapperStypes = {
      padding: `${this.boardHeight / 4}mm 10mm 0 10mm`,
      textAlign: 'center',
    };

    const titleStyles = {
      fontSize: '50px',
      fontWeight: '300',
    };

    const subtitleStyles = {
      fontSize: '25px',
      fontWeight: '100',
    };

    const footerStyles = {
      position: 'absolute',
      textAlign: 'center',
      bottom: 0,
      marginBottom: `${this.boardHeight / 6}mm`,
      width: '100%',
      lineHeight: 'initial',
    };

    const containerStyles = {
      position: 'relative',
      margin: `${this.bleedWidth}mm ${this.bleedWidth}mm ${this.bleedWidth}mm ${this.gutterWidth}mm`,
      height: `${this.fullHeight - (this.bleedWidth * 2)}mm`,
      width: `${this.backCoverWidth - this.bleedWidth - this.gutterWidth}mm`,
    };

    if (this.templatePreview) {
      styles.background = '#aaa';
      containerStyles.backgroundColor = this.backgroundColor;
    }

    const prettyStartDate = moment(this.startDate).format('MMM DD, YYYY');
    const prettyEndDate = moment(this.endDate).format('MMM DD, YYYY');

    return (<div style={styles}>
      <div style={containerStyles}>
        <div style={titlesWrapperStypes}>
          <div style={titleStyles}>{this.compilation.title}</div>
          <div style={subtitleStyles}>{this.compilation.subtitle}</div>
        </div>
        <div style={footerStyles}>{prettyStartDate} - {prettyEndDate}</div>
      </div>
    </div>);
  }
  render() {
    const mainStyles = {
      // width: `${this.fullWidth}mm`,
      // height: `${this.fullHeight}mm`,
      backgroundColor: this.backgroundColor,
      color: this.textColor,
      fontSize: '20px',
      letterSpacing: '0.5px',
      // backgroundImage: `url("${this.pattern}")`,
      fontFamily: '\'Montserrat\', sans-serif',
    };

    const classes = `
.casebound {
  width: ${this.fullWidth}mm;
  height: ${this.fullHeight}mm;
  background-color: #222222;
  background-image: url(${this.pattern});
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

export default CaseboundCoverTemplate;
