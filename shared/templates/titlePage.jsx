import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';

class TitlePageTemplate {
  constructor(page, props) {
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.page = page;
    this.compilation = props.compilation;

    this.defaultContent = {
      title: 'Demo Title',
      subtitle: 'Demo Subtitle',
    };

    this.content = this.page.content || this.defaultContent;
  }
  initialFormState() {
    return this.content;
  }
  renderTitle(title) {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '24px',
      textAlign: 'center',
      padding: '200px 0 0 0',
      fontWeight: 'bold',
    };

    return <div style={divStyle}>{title}</div>;
  }
  renderSubtitle(subtitle) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '17px',
      textAlign: 'center',
      padding: '15px 0 150px 0',
    };

    return <div style={divStyle}>{subtitle}</div>;
  }
  renderDates() {
    const prettyStartDate = moment(this.startDate).format('LL');
    const prettyEndDate = moment(this.endDate).format('LL');

    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '13px',
      textAlign: 'center',
      padding: '80px 0 20px 0',
    };

    return <div style={divStyle}>{prettyStartDate} - {prettyEndDate}</div>;
  }

  render() {
    return (<div style={{ fontSize: '20px' }}>
      {this.renderTitle(this.compilation.title)}
      {this.renderSubtitle(this.compilation.subtitle)}
      {this.renderDates()}
    </div>);
  }

  renderForm(setFormState) {
    const titleInput = <div className="editable" name="title" contentEditable onBlur={setFormState}>{this.content.title}</div>;
    const subtitleInput = <div className="editable" name="subtitle" contentEditable onBlur={setFormState}>{this.content.subtitle}</div>;

    return (<div style={{ fontSize: '20px', padding: '0 50px' }}>
      {this.renderTitle(titleInput)}
      {this.renderSubtitle(subtitleInput)}
      {this.renderDates()}
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

export default TitlePageTemplate;
