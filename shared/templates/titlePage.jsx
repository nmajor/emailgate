import React from 'react';
// import { renderToString } from 'react-dom/server';
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
  }

  render() {
    const content = this.page.content || this.defaultContent;
    const prettyStartDate = moment(this.startDate).format('LL');
    const prettyEndDate = moment(this.endDate).format('LL');

    return (<div style={{ textAlign: 'center', padding: '100px 0 100px 0' }}>
      <h1>{content.title}</h1>
      <h3>{content.subtitle}</h3>
      <h5>{prettyStartDate} - {prettyEndDate}</h5>
    </div>);
  }
}

export default TitlePageTemplate;
