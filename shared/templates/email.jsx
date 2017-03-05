import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import ReactQuill from 'react-quill';

class EmailTemplate {
  constructor(email) {
    this.email = email;

    this.email.subject = this.email.subject || 'No email subject';
    this.email.body = this.email.body || 'No email body';

    this.render = this.render.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.toString = this.toString.bind(this);
  }
  initialFormState() {
    return this.email;
  }

  mapEmailUser(user, index, array) {
    let text = user.name || user.address;

    // let text = `${user.name} - ${user.address}`;
    // if (!user.name && user.address) {
    //   text = user.address;
    // } else if (user.name && !user.address) {
    //   text = user.name;
    // }

    if (index !== (array.length - 1)) {
      text += ',';
      return <span key={index}><span style={{ whiteSpace: 'nowrap' }}>{text}</span> </span>;
    }

    return <span key={index} style={{ whiteSpace: 'nowrap' }}>{text}</span>;
  }
  renderAttachments(attachments) {
    const divStyle = {
      width: '100%',
    };

    const imageComponents = attachments.map((attachment, index) => {
      if (['image/jpeg', 'image/png'].indexOf(attachment.contentType) > -1) {
        const dataUriPrefix = `data:${attachment.contentType};base64,`;
        const imageString = new Buffer(attachment.content).toString('base64');
        return <img role="presentation" style={divStyle} key={index} src={dataUriPrefix + imageString} />;
      }
      return null;
    });

    return <div>{imageComponents}</div>;
  }

  renderSubject(subject) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '3px',
    };

    return <div style={divStyle}>{subject}</div>;
  }

  renderDate(date) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '11px',
      marginBottom: '2px',
      color: '#666',
    };

    return <div style={divStyle}>{moment(date).format('LL')}</div>;
  }

  renderFrom(from) {
    if (!from) { return null; }
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '12px',
      margin: '0',
    };

    return <div style={divStyle}>From: {from.map(this.mapEmailUser)}</div>;
  }

  renderTo(to) {
    if (!to) { return null; }
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '12px',
      margin: '6px 0',
    };

    return <div style={divStyle}>To: {to.map(this.mapEmailUser)}</div>;
  }

  bodyStyles() {
    return {
      fontFamily: '\'Libre Baskerville\', serif !important',
      lineHeight: '16px',
      fontSize: '9px',
      marginTop: '20px',
    };
  }
  renderBodyDangerously(body) {
    const divStyle = this.bodyStyles();

    return <div style={divStyle} dangerouslySetInnerHTML={{ __html: body }} />;
  }
  renderBody(body) {
    const divStyle = this.bodyStyles();

    return <div style={divStyle}>{body}</div>;
  }

  render() {
    const email = this.email;

    return (<div style={{ fontSize: '20px' }}>
      {this.renderDate(email.date)}
      {this.renderSubject(email.subject)}
      {this.renderFrom(email.from)}
      {this.renderBodyDangerously(email.body)}
      {this.renderAttachments(email.attachments)}
    </div>);
  }

  renderForm(setFormState, setBodyState) {
    const bodyInput = <ReactQuill className="editable" name="body" toolbar={false} styles={false} defaultValue={this.email.body} onChange={setBodyState} />;
    const subjectInput = <div className="editable" name="subject" contentEditable onBlur={setFormState}>{this.email.subject}</div>;

    return (<div style={{ fontSize: '20px' }}>
      {this.renderDate(this.email.date)}
      {this.renderSubject(subjectInput)}
      {this.renderFrom(this.email.from)}
      {this.renderBody(bodyInput)}
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

export default EmailTemplate;

// Font Sizes
// Points	 Pixels	 Ems
// 6pt	     8px	   0.5em
// 7pt	     9px	   0.55em
// 8pt	     11px	   0.7em
// 9pt	     12px	   0.75em
// 10pt	   13px	   0.8em
// 10.5pt	 14px	   0.875em
// 11pt	   15px	   0.95em
// 12pt	   16px	   1em
// 13pt	   17px	   1.05em
// 13.5pt	 18px	   1.125em
// 14pt	   19px	   1.2em
// 14.5pt	 20px	   1.25em
// 15pt	   21px	   1.3em
// 16pt	   22px	   1.4em
// 17pt	   23px	   1.45em
// 18pt	   24px	   1.5em
