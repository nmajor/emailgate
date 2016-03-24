import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationEmailNav from '../components/CompilationEmailNav';
import CompilationEmailsListContainer from './CompilationEmailsListContainer';
import CompilationEmailFormContainer from './CompilationEmailFormContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import { Link } from 'react-router';

class EditCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationEmails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails(this.props.params.compilationId));
    }

    this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
    this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
  }
  renderAddLink() {
    return (<Link
      className="btn btn-primary btn-block bottom-bumper"
      to={`/compilations/${this.props.params.compilationId}/emails/add`}
    >
      Add Emails
    </Link>);
  }
  renderForm() {
    if (this.currentEmail) {
      return (
        <div>
          <CompilationEmailNav email={this.currentEmail} currentPage="edit" />
          <CompilationEmailFormContainer compilation={this.compilation} email={this.currentEmail} />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <CompilationNav compilationId={this.props.params.compilationId} currentPage="emails" />
        <div className="container">
          <h1>Compilation Emails ({this.props.compilationEmails.length})</h1>
          <div className="row">
            <div className="col-md-3">
              {this.renderAddLink()}
              <CompilationEmailsListContainer currentEmailId={this.props.params.emailId} compilation={this.compilation} />
            </div>
            <div className="col-md-9">
              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditCompilationEmailsContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationEmails.bind(null, params.compilationId, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
  };
}

EditCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditCompilationEmailsContainer);
