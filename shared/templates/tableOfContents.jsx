import React from 'react';
// import { renderToString } from 'react-dom/server';

class TitlePageTemplate {
  constructor(page) {
    this.page = page;

    this.defaultContent = {
      title: 'Demo Title',
      subtitle: 'Demo Subtitle',
    };
  }

  render() {
    const content = this.page.content || this.defaultContent;

    return (<div style={{ textAlign: 'center', padding: '100px 0 100px 0' }}>
      <h1>{content.title}</h1>
      <h1>{content.subtitle}</h1>
    </div>);
  }
}

export default TitlePageTemplate;
