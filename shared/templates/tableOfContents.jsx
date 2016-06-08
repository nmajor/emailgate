import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
// import _ from 'lodash';

class TableOfContentsTemplate {
  constructor(page, props) {
    this.emails = props.emails;

    this.renderEntry = this.renderEntry.bind(this);
    this.pageMap = props.pageMap;
    this.page = page;
  }
  renderEntry(email, index) {
    const prettyDate = moment(email.date).format('LL');

    const entryStyle = {
      padding: '1px 0',
      marginBottom: '15px',
      borderBottom: '1px dotted #000',
    };

    const subjectStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '1em',
      textAlign: 'left',
      fontWeight: 'bold',
      maxWidth: '80%',
    };

    const dateStyle = {
      fontSize: '0.6em',
      fontFamily: '\'Libre Baskerville\', serif',
      display: 'inline-block',
      width: '50%',
      textAlign: 'left',
    };

    const pageStyle = {
      fontSize: '.8em',
      fontFamily: '\'Montserrat\', sans-serif',
      display: 'inline-block',
      width: '50%',
      textAlign: 'right',
    };

    const pageNum = this.pageMap[email._id] || (index + 1);

    return (
      <div key={index} style={entryStyle}>
        <div style={subjectStyle}>{email.subject}</div>
        <div style={{ lineHeight: '1em' }}>
          <div style={dateStyle}>{prettyDate}</div>
          <div style={pageStyle}>{pageNum}</div>
        </div>
      </div>
    );
  }
  renderEntries() {
    return this.emails.map(this.renderEntry);
  }
  renderPageHeader() {
    const divStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2em',
    };

    return <div style={divStyle}>Table of Contents</div>;
  }

  render() {
    return (<div style={{ fontSize: '20px' }}>
      {this.renderPageHeader()}
      {this.renderEntries()}
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

export default TableOfContentsTemplate;
