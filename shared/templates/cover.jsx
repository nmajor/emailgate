import React from 'react';
import { renderToString } from 'react-dom/server';

class CoverTemplate {
  constructor(page, props) {
    this.page = page;
    this.compilation = props.compilation;
    this.content = this.page.content || this.defaultContent;
  }
  initialFormState() {
    return this.content;
  }
  renderTitle(title) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '3em',
      textAlign: 'center',
      padding: '100px 0 0 0',
      fontWeight: 'bold',
    };

    return <div style={divStyle}>{title}</div>;
  }
  renderSubtitle(subtitle) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '1.5em',
      textAlign: 'center',
      padding: '15px 0 100px 0',
    };

    return <div style={divStyle}>{subtitle}</div>;
  }
  render() {
    const mainStyles = {
      background: '#222',
      color: '#fff',
      fontSize: '20px',
    };

    return (<div style={mainStyles}>
      {this.renderTitle(this.compilation.title)}
      {this.renderSubtitle(this.compilation.subtitle)}
    </div>);
  }

  renderForm(setFormState) {
    const titleInput = <div className="editable" name="title" contentEditable onBlur={setFormState}>{this.content.title}</div>;
    const subtitleInput = <div className="editable" name="subtitle" contentEditable onBlur={setFormState}>{this.content.subtitle}</div>;

    return (<div style={{ fontSize: '20px' }}>
      {this.renderTitle(titleInput)}
      {this.renderSubtitle(subtitleInput)}
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

export default CoverTemplate;
