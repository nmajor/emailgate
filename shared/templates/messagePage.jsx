import React from 'react';
import { renderToString } from 'react-dom/server';

class MessagePageTemplate {
  constructor(page, props) {
    this.props = props;
    this.page = page;

    this.defaultContent = {
      message: 'Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod.',
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
      fontSize: '0.8em',
      textAlign: 'left',
      padding: '250px 60px 0 60px',
    };

    return <div style={divStyle}>{message}</div>;
  }
  renderSignature(signature) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '1em',
      textAlign: 'left',
      padding: '15px 60px 250px 60px',
    };

    return <div style={divStyle}>{signature}</div>;
  }

  render() {
    return (<div>
      {this.renderMessage(this.content.message)}
      {this.renderSignature(this.content.signature)}
    </div>);
  }

  renderForm(setFormState) {
    const messageInput = <div className="editable" name="message" contentEditable onBlur={setFormState}>{this.content.message}</div>;
    const signatureInput = <div className="editable" name="signature" contentEditable onBlur={setFormState}>{this.content.signature}</div>;

    return (<div>
      {this.renderMessage(messageInput)}
      {this.renderSignature(signatureInput)}
    </div>);
  }

  toString() {
    return `
      <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

      ${renderToString(this.render())}
    `;
  }
}

export default MessagePageTemplate;
