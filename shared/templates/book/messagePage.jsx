import React from 'react';
import { renderToString } from 'react-dom/server';

class MessagePageTemplate {
  constructor(page, props) {
    this.props = props;
    this.page = page;

    this.defaultContent = {
      message: 'Your custom message goes here. You can add a quote, special message, or a forward for this book.',
      signature: 'John Doe',
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
  renderMessageDangerously(message) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '13px',
      textAlign: 'left',
      padding: '250px 10px 0 10px',
    };

    return <div style={divStyle} dangerouslySetInnerHTML={{ __html: message }} />;
  }
  renderSignature(signature) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '16px',
      textAlign: 'left',
      padding: '15px 10px 250px 10px',
    };

    return <div style={divStyle}>{signature}</div>;
  }

  render() {
    return (<div style={{ fontSize: '20px', padding: '0 50px' }}>
      {this.renderMessageDangerously(this.content.message)}
      {this.renderSignature(this.content.signature)}
    </div>);
  }
  renderForm(setFormState) {
    function setMessageState(value) {
      setFormState(undefined, { message: value });
    }

    let messageInput = <textarea />;
    try {
      const ReactQuill = require('react-quill'); // eslint-disable-line global-require

      messageInput = <ReactQuill className="editable" name="message" toolbar={false} styles={false} defaultValue={this.content.message} onChange={setMessageState} />;
    } catch (err) {} // eslint-disable-line

    const signatureInput = <div className="editable" name="signature" contentEditable onBlur={setFormState}>{this.content.signature}</div>;

    return (<div className="page-form" style={{ fontSize: '20px', padding: '0 50px' }}>
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
