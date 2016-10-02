import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';
import * as Actions from '../redux/actions/index';
import CoverTemplate from '../templates/cover';
import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';

class EditCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.save = this.save.bind(this);

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
          return new CoverTemplate(page);
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
          // Cant edit table of contents page
          return null;
        }
        default : {
          return null;
        }
      }
    }
  }
  save(pageProps) {
    this.props.dispatch(Actions.updateCompilationPage(this.props.compilation._id, this.currentPage, pageProps));
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentPage={this.currentPage} edit={this.save} componentProps={this.getComponentProps()} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
    compilationEmails: store.compilationEmails,
  };
}

EditCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditCompilationPageContainer);
