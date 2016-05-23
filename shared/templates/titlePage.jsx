import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';

class TitlePageTemplate {
  constructor(page, props) {
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.page = page;

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
      fontSize: '3em',
      textAlign: 'center',
      padding: '150px 0 0 0',
      fontWeight: 'bold',
    };

    return <div style={divStyle}>{title}</div>;
  }
  renderSubtitle(subtitle) {
    const divStyle = {
      fontFamily: '\'Libre Baskerville\', serif',
      fontSize: '1.5em',
      textAlign: 'center',
      padding: '15px 0 250px 0',
    };

    return <div style={divStyle}>{subtitle}</div>;
  }
  renderDates() {
    const prettyStartDate = moment(this.startDate).format('LL');
    const prettyEndDate = moment(this.endDate).format('LL');

    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '0.8em',
      textAlign: 'center',
      padding: '100px 0 50px 0',
    };

    return <div style={divStyle}>{prettyStartDate} - {prettyEndDate}</div>;
  }

  render() {
    return (<div style={{ fontSize: '20px' }}>
      {this.renderTitle(this.content.title)}
      {this.renderSubtitle(this.content.subtitle)}
      {this.renderDates()}
    </div>);
  }

  renderForm(setFormState) {
    const titleInput = <div className="editable" name="title" contentEditable onBlur={setFormState}>{this.content.title}</div>;
    const subtitleInput = <div className="editable" name="subtitle" contentEditable onBlur={setFormState}>{this.content.subtitle}</div>;

    return (<div style={{ fontSize: '20px', padding: '50px' }}>
      {this.renderTitle(titleInput)}
      {this.renderSubtitle(subtitleInput)}
      {this.renderDates()}
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

export default TitlePageTemplate;
