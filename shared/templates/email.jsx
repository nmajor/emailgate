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

  renderSubject(subject) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontWeight: 'bold',
      fontSize: '1.4em',
      marginBottom: '.3em',
    };

    return <div style={divStyle}>{subject}</div>;
  }

  renderDate(date) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '0.9em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>{moment(date).format('LL')}</div>;
  }

  renderFrom(from) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '0.8em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>From: {from.map(this.mapEmailUser)}</div>;
  }

  renderTo(to) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '0.8em',
      margin: '.3em 0',
    };

    return <div style={divStyle}>To: {to.map(this.mapEmailUser)}</div>;
  }

  bodyStyles() {
    return {
      fontFamily: '\'Libre Baskerville\', serif',
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
    const subject = this.renderSubject(email.subject);
    const date = this.renderDate(email.date);
    const from = this.renderFrom(email.from);
    const to = this.renderTo(email.to);
    const body = this.renderBodyDangerously(email.body);

    return (<div>
      {subject}
      {date}
      {from}
      {to}
      {body}
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
    const subject = this.renderSubject(email.subject);
    const date = this.renderDate(email.date);
    const from = this.renderFrom(email.from);
    const to = this.renderTo(email.to);
    const body = this.renderBodyDangerously(email.body);

    return `
      <link href='https://fonts.googleapis.com/css?family=Libre+Baskerville' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

      ${renderToString(subject)}
      ${renderToString(date)}
      ${renderToString(from)}
      ${renderToString(to)}
      ${renderToString(body)}
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
