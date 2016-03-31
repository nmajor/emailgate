import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import CompilationPageView from '../components/CompilationPageView';

import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';
import TableOfContentsTemplate from '../templates/tableOfContents';

class ViewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  templateFactory() {
    if (this.props.currentPage) {
      switch (this.props.currentPage.type) {
        case 'title-page' :
          const sortedEmails = _.sortBy(this.props.compilationEmails, (email) => { return email.date; });
          const firstEmail = sortedEmails[0] || {};
          const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
          const startDate = firstEmail.date;
          const endDate = lastEmail.date;
          return new TitlePageTemplate(this.props.currentPage, { startDate, endDate });
        case 'message-page' :
          return new MessagePageTemplate(this.props.currentPage);
        case 'table-of-contents' :
          return new TableOfContentsTemplate(this.props.currentPage, { emails: _.sortBy(this.props.compilationEmails, (email) => { return email.date; }) });
        default :
          return null;
      }
    }
  }

  render() {
    return (
      <div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="view" />
        <CompilationPageView compilation={this.props.compilation} page={this.props.currentPage} template={this.templateFactory()} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}


ViewCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  currentPage: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ViewCompilationPageContainer);
