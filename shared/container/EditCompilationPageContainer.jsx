import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import CompilationPageForm from '../components/CompilationPageForm';
import * as Actions from '../redux/actions/index';

import CoverTemplate from '../templates/cover';
import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';

class EditCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.save = this.save.bind(this);
  }
  save(pageProps) {
    this.props.dispatch(Actions.updateCompilationPage(this.props.compilation._id, this.props.currentPage, pageProps));
  }

  templateFactory() {
    if (this.props.currentPage) {
      switch (this.props.currentPage.type) {
        case 'cover' :
          return new CoverTemplate(this.props.currentPage);
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
          // Cant edit table of contents page
          return null;
        default :
          return null;
      }
    }
  }

  render() {
    return (
      <div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="edit" />
        <CompilationPageForm submitForm={this.save} compilation={this.props.compilation} page={this.props.currentPage} template={this.templateFactory()} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}


EditCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  currentPage: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(EditCompilationPageContainer);
