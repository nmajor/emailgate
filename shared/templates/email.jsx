import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import ReactQuill from 'react-quill';

class EmailTemplate {
  constructor(email) {
    this.email = email;

    this.render = this.render.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.toString = this.toString.bind(this);
  }
  initialFormState() {
    return this.email;
  }

  mapEmailUser(user, index, array) {
    let text = `${user.name} - ${user.address}`;

    if (!user.name && user.address) {
      text = user.address;
    } else if (user.name && !user.address) {
      text = user.name;
    }

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
        return <img style={divStyle} key={index} src={dataUriPrefix + imageString} />;
      }
      return null;
    });

    return <div>{imageComponents}</div>;
  }

  renderSubject(subject) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontWeight: 'bold',
      fontSize: '1.4em',
      marginBottom: '.3em',
    };

    return <div style={divStyle}>{subject}</div>;
  }

  renderDate(date) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '0.9em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>{moment(date).format('LL')}</div>;
  }

  renderFrom(from) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '0.8em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>From: {from.map(this.mapEmailUser)}</div>;
  }

  renderTo(to) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '0.8em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>To: {to.map(this.mapEmailUser)}</div>;
  }

  bodyStyles() {
    return {
      fontFamily: '\'Libre Baskerville\', serif !important',
      lineHeight: '1.2em',
      fontSize: '0.95em',
      marginTop: '1.5em',
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

    return (<div>
      {this.renderSubject(email.subject)}
      {this.renderDate(email.date)}
      {this.renderFrom(email.from)}
      {this.renderTo(email.to)}
      {this.renderBodyDangerously(email.body)}
      {this.renderAttachments(email.attachments)}
    </div>);
  }

  renderForm(setFormState, setBodyState) {
    const bodyInput = <ReactQuill className="editable" name="body" toolbar={false} styles={false} defaultValue={this.email.body} onChange={setBodyState} />;
    const subjectInput = <div className="editable" name="subject" contentEditable onBlur={setFormState}>{this.email.subject}</div>;

    return (<div>
      {this.renderSubject(subjectInput)}
      {this.renderDate(this.email.date)}
      {this.renderFrom(this.email.from)}
      {this.renderTo(this.email.to)}
      {this.renderBody(bodyInput)}
    </div>);
  }

  toString() {
    const email = this.email;

    return `
      <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

      ${renderToString(this.renderSubject(email.subject))}
      ${renderToString(this.renderDate(email.date))}
      ${renderToString(this.renderFrom(email.from))}
      ${renderToString(this.renderTo(email.to))}
      ${renderToString(this.renderBodyDangerously(email.body))}
      ${renderToString(this.renderAttachments(email.attachments))}
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
