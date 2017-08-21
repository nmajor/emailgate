import React from 'react';
import { renderToString } from 'react-dom/server';

class MessagePageTemplate {
  constructor(page, props) {
    this.props = props;
    this.page = page;

    this.defaultContent = {
      image: {
        url: 'http://via.placeholder.com/432x648',
      },
      header: 'Edit Page to Change This Header',
    };

    this.content = this.page.content || this.defaultContent;
  }
  initialFormState() {
    return this.content;
  }
  renderMessage(message) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '13px',
      textAlign: 'left',
      padding: '250px 10px 0 10px',
    };

    return <div style={divStyle}>{message}</div>;
  }
  renderImage() {
    return (<div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img role="presentation" src={this.content.image.url} />
    </div>);
  }
  renderHeader() {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '3px',
    };

    return <div style={divStyle}>{this.content.header}</div>;
  }
  render() {
    return (<div style={{ fontSize: '20px', padding: '0 50px' }}>
      {this.renderImage()}
    </div>);
  }

  renderForm(setFormState) {
    const messageInput = <div className="editable" name="message" contentEditable onBlur={setFormState}>{this.content.message}</div>;
    const signatureInput = <div className="editable" name="signature" contentEditable onBlur={setFormState}>{this.content.signature}</div>;

    return (<div style={{ fontSize: '20px', padding: '0 50px' }}>
      {this.renderMessage(messageInput)}
      {this.renderSignature(signatureInput)}
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

export default MessagePageTemplate;
