import React, { PropTypes, Component } from 'react';
// import CoverTemplate from '../templates/cover';
// import TitlePageTemplate from '../templates/titlePage';
// import MessagePageTemplate from '../templates/messagePage';
// import TableOfContentsTemplate from '../templates/tableOfContents';
// import _ from 'lodash';
// import { pageMeta } from '../helpers';

class CompilationPageView extends Component {
  renderTemplate() {
    if (this.props.page.html) {
      return <div dangerouslySetInnerHTML={{ __html: this.props.page.html }} />;
    }
  }
  render() {
    return (<div className="compilation-page">
      {this.renderTemplate()}
    </div>);
  }
}

CompilationPageView.propTypes = {
  page: PropTypes.object.isRequired,
};

export default CompilationPageView;
