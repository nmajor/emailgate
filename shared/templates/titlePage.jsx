import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import fonts from './covers/utils/fonts';

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

    this.primaryFont = fonts.raleway;
    this.secondaryFont = fonts.roboto;

    this.pixelsPerInch = 72;
    this.heightIn = 7;
    this.heightPx = this.heightIn * this.pixelsPerInch;

    this.content = this.page.content || this.defaultContent;
  }
  initialFormState() {
    return this.content;
  }
  renderTitle(title) {
    const divStyle = {
      fontFamily: this.primaryFont.family,
      fontSize: '24px',
      textAlign: 'center',
      padding: '30% 0 0 0',
      fontWeight: '400',
    };

    return <div style={divStyle}>{title}</div>;
  }
  renderSubtitle(subtitle) {
    const divStyle = {
      fontFamily: this.secondaryFont.family,
      fontSize: '14px',
      textAlign: 'center',
      fontWeight: '100',
      padding: '5px 0 150px 0',
    };

    return <div style={divStyle}>{subtitle}</div>;
  }
  renderDates() {
    if (this.startDate && this.endDate) {
      const prettyStartDate = moment(this.startDate).format('LL');
      const prettyEndDate = moment(this.endDate).format('LL');

      const divStyle = {
        fontFamily: this.secondaryFont.family,
        fontSize: '10px',
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
      };

      return <div style={divStyle}>{prettyStartDate} - {prettyEndDate}</div>;
    }
  }

  render() {
    return (<div style={{ position: 'relative', height: `${this.heightPx}px`, fontSize: '20px', overflow: 'hidden' }}>
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
    ${this.primaryFont.link}
    ${this.secondaryFont.link}
  </head>
  <body>
  ${renderToString(this.render())}
  </body>
</html>
    `;
  }
}

export default TitlePageTemplate;
