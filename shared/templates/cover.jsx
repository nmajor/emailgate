import React from 'react';
import { renderToString } from 'react-dom/server';

class CoverTemplate {
  constructor(page) {
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
  render() {
    const mainStyles = {
      background: '#222',
      color: '#fff',
      fontSize: '20px',
    };

    return (<div style={mainStyles}>
      {this.renderTitle(this.content.title)}
      {this.renderSubtitle(this.content.subtitle)}
    </div>);
  }

  renderForm(setFormState) {
    const titleInput = <div className="editable" name="title" contentEditable onBlur={setFormState}>{this.content.title}</div>;
    const subtitleInput = <div className="editable" name="subtitle" contentEditable onBlur={setFormState}>{this.content.subtitle}</div>;

    return (<div style={{ fontSize: '20px' }}>
      {this.renderTitle(titleInput)}
      {this.renderSubtitle(subtitleInput)}
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

export default CoverTemplate;
