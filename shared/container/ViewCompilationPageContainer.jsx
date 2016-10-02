import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { emailPageMap } from '../helpers';
import CoverTemplate from '../templates/cover';
import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';
import TableOfContentsTemplate from '../templates/tableOfContents';
import CompilationBuildContainer from './CompilationBuildContainer';

class ViewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.templateFactory = this.templateFactory.bind(this);

    if (this.props.params.pageId) {
      this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId) {
      this.currentPage = _.find(nextProps.compilationPages, { _id: nextProps.params.pageId });
    }
  }
  getComponentProps() {
    return {
      templateFactory: this.templateFactory,
    };
  }
  templateFactory(page) {
    if (page) {
      switch (page.type) {
        case 'cover' : {
          return new CoverTemplate(page, { compilation: this.props.compilation });
        }
        case 'title-page' : {
          const sortedEmails = _.sortBy(this.props.compilationEmails, (email) => { return email.date; });
          const firstEmail = sortedEmails[0] || {};
          const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
          const startDate = firstEmail.date;
          const endDate = lastEmail.date;
          return new TitlePageTemplate(page, { startDate, endDate, compilation: this.props.compilation });
        }
        case 'message-page' : {
          return new MessagePageTemplate(page);
        }
        case 'table-of-contents' : {
          return new TableOfContentsTemplate(page, {
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
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentPage={this.currentPage} componentProps={this.getComponentProps()} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
    compilationEmails: store.compilationEmails,
  };
}

ViewCompilationPageContainer.propTypes = {
  compilationPages: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationPageContainer);
