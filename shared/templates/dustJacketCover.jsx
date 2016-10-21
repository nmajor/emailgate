import React from 'react';
// import { renderToString } from 'react-dom/server';

class DustJacketCoverTemplate {
  constructor(props) {
    this.compilation = props.compilation;

    // http://www.ingramcontent.com/Documents/CoverBleedDimensions.pdf

    // In milimeters (mm)
    this.bleedWidth = 3;
    this.foldWidth = 6;
    this.flapWidth = 83;
    this.coverWidth = 164;
    this.coverHeight = 235;

    this.backFlapWidth = this.bleedWidth + this.flapWidth + this.foldWidth;
    this.backCoverWidth = this.coverWidth;
    this.spineWidth = this.compilation.cover.spineWidth || 50;
    this.frontCoverWidth = this.coverWidth;
    this.frontFlapWidth = this.foldWidth + this.flapWidth + this.bleedWidth;

    this.fullWidth = this.backFlapWidth + this.backCoverWidth + this.spineWidth + this.frontCoverWidth + this.frontFlapWidth;
    this.fullHeight = this.bleedWidth + this.coverHeight + this.bleedWidth;
  }
  renderBackFlap() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.backFlapWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#ccc',
      color: '#000',
      fontSize: '20px',
    };

    return <div style={styles}></div>;
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
      padding: '0 15mm',
      textAlign: 'center',
    };

    const titleStyles = {
      fontSize: '30px',
    };

    const subtitleStyles = {
      fontSize: '20px',
    };

    return (<div style={styles}>
      <div style={{ height: '100%' }}>
        <div style={titlesWrapperStypes}>
          <div style={titleStyles}>{this.compilation.title}</div>
          <div style={subtitleStyles}>{this.compilation.subtitle}</div>
        </div>
      </div>
    </div>);
  }
  renderFrontFlap() {
    const styles = {
      display: 'inline-block',
      verticalAlign: 'top',
      width: `${this.frontFlapWidth}mm`,
      height: `${this.fullHeight}mm`,
      background: '#ccc',
      color: '#000',
      fontSize: '20px',
    };

    return (<div style={styles}></div>);
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
      {this.renderBackFlap()}
      {this.renderBackCover()}
      {this.renderSpine()}
      {this.renderFrontCover()}
      {this.renderFrontFlap()}
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

export default DustJacketCoverTemplate;
