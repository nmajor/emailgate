import React from 'react';
// import { renderToString } from 'react-dom/server';

class CaseboundCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;

    // http://www.ingramcontent.com/Documents/CoverBleedDimensions.pdf

    // In milimeters (mm)
    this.bleedWidth = 16;
    this.gutterWidth = 13;
    this.boardWidth = 148;
    this.boardHeight = 235;

    this.spineWidth = this.compilation.spineWidth || 38;

    this.backCoverWidth = this.bleedWidth + this.boardWidth + this.gutterWidth;
    this.frontCoverWidth = this.gutterWidth + this.boardWidth + this.bleedWidth;

    this.fullWidth = this.frontCoverWidth + this.spineWidth + this.frontCoverWidth;
    this.fullHeight = this.bleedWidth + this.boardHeight + this.bleedWidth;
  }
  renderBackCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.backCoverWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#aaa',
      color: '#000',
      fontSize: '20px',
    };

    return (<div style={styles}>
    </div>);
  }
  renderSpine() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.spineWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#666',
      color: '#fff',
      fontSize: '20px',
    };

    return (<div style={styles}></div>);
  }
  renderFrontCover() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontCoverWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#aaa',
      color: '#000',
      fontSize: '20px',
    };

    const titlesWrapperStypes = {
      background: '#fff',
      flexGrow: '1',
      padding: '0 15mm',
      textAlign: 'center',
    };

    const titleStyles = {
      fontSize: '30px',
    };

    const subtitleStyles = {
      fontSize: '20px',
    };

    const containerStyles = {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `${this.bleedWidth}mm ${this.bleedWidth}mm ${this.bleedWidth}mm ${this.gutterWidth}mm`,
    };

    const bumperStyles = {
      background: '#fff',
      flexGrow: '1',
    };

    return (<div style={styles}>
      <div style={containerStyles}>
        <div style={bumperStyles}></div>
        <div style={titlesWrapperStypes}>
          <div style={titleStyles}>{this.compilation.title}</div>
          <div style={subtitleStyles}>{this.compilation.subtitle}</div>
        </div>
        <div style={bumperStyles}></div>
      </div>
    </div>);
  }
  render() {
    const mainStyles = {
      width: `${this.fullWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#eee',
      color: '#000',
      fontSize: '20px',
    };

    return (<div style={mainStyles}>
      {this.renderBackCover()}
      {this.renderSpine()}
      {this.renderFrontCover()}
    </div>);
  }
//   toString() {
//     return `
// <div>
// <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
// <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
// ${renderToString(this.render())}
// </div>
//     `;
//   }
}

export default CaseboundCoverTemplate;
