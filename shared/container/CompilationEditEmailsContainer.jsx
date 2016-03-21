import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationEmailsContainer from './CompilationEmailsContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationEditEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.id }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.id }) || {};
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <CompilationNav compilationId={this.props.params.id} currentPage="edit-emails" />
        <div className="container">
          <h1>Edit Compilation Emails</h1>
          <CompilationEmailsContainer compilation={this.compilation} />
        </div>
      </div>
    );
  }
}

CompilationEditEmailsContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationEmails.bind(null, params.id, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
    selectedCompilationEmailId: store.selectedCompilationEmailId,
    editingSelectedCompilationEmail: store.editingSelectedCompilationEmail,
  };
}

CompilationEditEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEditEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
  editingSelectedCompilationEmail: PropTypes.bool.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationEditEmailsContainer);
