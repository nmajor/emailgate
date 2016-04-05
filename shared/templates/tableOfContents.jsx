import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import _ from 'lodash';

class TableOfContentsTemplate {
  constructor(page, props) {
    if (props.emails.length > 0) {
      this.emails = props.emails;
    } else {
      this.emails = _.map(_.range(10), (index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);

        return {
          subject: `Example Email Subject ${index + 1}`,
          date,
        };
      });
    }

    this.renderEntry = this.renderEntry.bind(this);
    this.pageMap = props.pageMap;
    this.page = page;
  }
  renderEntry(email, index) {
    const prettyDate = moment(email.date).format('LL');

    const entryStyle = {
      padding: '1px 0',
      marginBottom: '10px',
      borderBottom: '1px dotted #000',
    };

    const subjectStyle = {
      fontFamily: '\'Montserrat\', sans-serif',
      fontSize: '1em',
      textAlign: 'left',
      fontWeight: 'bold',
    };

    const dateStyle = {
      fontSize: '0.6em',
      padding: '0 0 0 10px',
      fontFamily: '\'Libre Baskerville\', serif',
    };

    const pageStyle = {
      textAlign: 'right',
      fontFamily: '\'Montserrat\', sans-serif',
      float: 'right',
    };

    return (
      <div key={index} style={entryStyle}>
        <span style={subjectStyle}>{email.subject}</span>
        <span style={dateStyle}>{prettyDate}</span>
        <span style={pageStyle}>{this.pageMap[email._id]}</span>
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
    return (<div>
      {this.renderPageHeader()}
      {this.renderEntries()}
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

export default TableOfContentsTemplate;
