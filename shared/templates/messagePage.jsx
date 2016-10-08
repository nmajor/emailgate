import React from 'react';
import { renderToString } from 'react-dom/server';

class MessagePageTemplate {
  constructor(page, props) {
    this.props = props;
    this.page = page;

    this.defaultContent = {
      message: 'Your custom message goes here',
      signature: 'Your name goes here',
    };

    this.content = this.page.content || this.defaultContent;
  }
  initialFormState() {
    return this.content;
  }
  renderMessage(message) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '0.8em',
      textAlign: 'left',
      padding: '250px 10px 0 10px',
    };

    return <div style={divStyle}>{message}</div>;
  }
  renderSignature(signature) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '1em',
      textAlign: 'left',
      padding: '15px 10px 250px 10px',
    };

    return <div style={divStyle}>{signature}</div>;
  }

  render() {
    return (<div style={{ fontSize: '20px', padding: '0 50px' }}>
      {this.renderMessage(this.content.message)}
      {this.renderSignature(this.content.signature)}
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
<div>
<link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
${renderToString(this.render())}
</div>
    `;
  }
}

export default MessagePageTemplate;
