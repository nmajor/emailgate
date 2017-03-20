import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';

class EmailDateInput extends Component { // eslint-disable-line
  // constructor(email) {
  // }
  render() {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '11px',
      marginBottom: '2px',
      color: '#666',
      border: '1px solid #CCC',
    };

    return <span style={divStyle} className="pointer" onClick={this.props.onClick}>{this.props.value}</span>; // eslint-disable-line
  }
}

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

    return <div style={divStyle}>{date}</div>;
  }

  renderFrom(fromText) {
    if (!fromText) { return null; }
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif !important',
      fontSize: '12px',
      margin: '0',
    };

    return <div style={divStyle}>From: {fromText}</div>;
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
      {this.renderDate(moment(email.date).format('LL'))}
      {this.renderSubject(email.subject)}
      {this.renderFrom(email.from.map(this.mapEmailUser))}
      {this.renderBodyDangerously(email.body)}
      {this.renderAttachments(email.attachments)}
    </div>);
  }

  renderFromInput(users, field, setFormState) {
    function removeItem(index) {
      const newState = {};
      newState[field] = [
        ...users.slice(0, index),
        ...users.slice(index + 1),
      ];
      setFormState(undefined, newState);
    }

    function addItem() {
      const newState = {};
      newState[field] = [
        ...users,
        { name: '', address: '' },
      ];
      setFormState(undefined, newState);
    }

    function updateItem(event, index) {
      console.log('balh updateitem');
      const newState = {};
      newState[field] = [
        ...users.slice(0, index),
        { name: event.target.innerHTML },
        ...users.slice(index + 1),
      ];
      setFormState(undefined, newState);
    }

    const inputItems = users.map((user, index) => {
      const text = user.name || user.address;

      return <div key={index}><span style={{ display: 'inline-block', minWidth: '150px' }} className="editable" contentEditable onBlur={(event) => { updateItem(event, index); }}>{text}</span> <span onClick={() => { removeItem(index); }} className="btn btn-danger btn-xs-true btn-xs"><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></span></div>;
    });

    return (<div>
      {inputItems}
      <div><span className="btn btn-default btn-xs-true" onClick={addItem}><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> From Entry</span></div>
    </div>);
  }

  renderForm(setFormState, setBodyState) {
    const bodyInput = <ReactQuill className="editable" name="body" toolbar={false} styles={false} defaultValue={this.email.body} onChange={setBodyState} />;
    const subjectInput = <div className="editable" name="subject" contentEditable onBlur={setFormState}>{this.email.subject}</div>;
    const dateInput = (<DatePicker
      style={{ display: 'inline-block' }}
      className="inline-block form-control"
      name="Start Date"
      showYearDropdown
      fixedHeight
      dateFormat="LL"
      selected={this.email.date ? moment(this.email.date, 'YYYY/M/D') : null}
      onChange={(params) => { setFormState(undefined, { date: params.toDate() }); }}
      customInput={<EmailDateInput />}
    />);

    return (<div style={{ fontSize: '20px' }}>
      {dateInput}
      {this.renderSubject(subjectInput)}
      {this.renderFrom(this.renderFromInput(this.email.from, 'from', setFormState))}
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
