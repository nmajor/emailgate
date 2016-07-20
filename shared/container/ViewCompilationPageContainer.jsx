import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import CompilationPageView from '../components/CompilationPageView';
import { emailPageMap, pageMeta } from '../helpers';
import CoverTemplate from '../templates/cover';
import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';
import TableOfContentsTemplate from '../templates/tableOfContents';

class ViewCompilationPageContainer extends Component {
  templateFactory() {
    if (this.props.currentPage) {
      switch (this.props.currentPage.type) {
        case 'cover' : {
          return new CoverTemplate(this.props.currentPage);
        }
        case 'title-page' : {
          const sortedEmails = _.sortBy(this.props.compilationEmails, (email) => { return email.date; });
          const firstEmail = sortedEmails[0] || {};
          const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
          const startDate = firstEmail.date;
          const endDate = lastEmail.date;
          return new TitlePageTemplate(this.props.currentPage, { startDate, endDate });
        }
        case 'message-page' : {
          return new MessagePageTemplate(this.props.currentPage);
        }
        case 'table-of-contents' : {
          return new TableOfContentsTemplate(this.props.currentPage, {
            emails: _.sortBy(this.props.compilationEmails, (email) => { return email.date; }),
            pageMap: emailPageMap(this.props.compilationEmails),
          });
        }
        default : {
          return null;
        }
      }
    }
  }
  renderMessage() {
    if (this.props.currentPage.type !== 'table-of-contents' && this.props.currentPage.updatedAt === this.props.currentPage.createdAt) {
      return <span className="text-loud h3-header-helper left-bumper">This page needs to be customized</span>;
    }
  }
  render() {
    return (<div>
      <h3>{pageMeta(this.props.currentPage).desc}{this.renderMessage()}</h3>
      <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="view" />
      <div className="tab-content">
        <CompilationPageView compilation={this.props.compilation} page={this.props.currentPage} template={this.templateFactory()} />
      </div>
    </div>);
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
  currentPage: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationPageContainer);
