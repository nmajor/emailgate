import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationEmailsList from '../components/CompilationEmailsList';
import CompilationEmailPreview from '../components/CompilationEmailPreview';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationAddEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSelectedCompilationEmail = this.setSelectedCompilationEmail.bind(this);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.id }) || {};

    if (this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(this.props.compilationEmails, { _id: this.props.selectedCompilationEmailId }) || {};
    } else { this.selectedCompilationEmail = {}; }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCompilationEmailId !== this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(nextProps.compilationEmails, { _id: nextProps.selectedCompilationEmailId }) || {};
    }

    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.id }) || {};
  }
  setSelectedCompilationEmail(email) {
    this.props.dispatch(Actions.setSelectedCompilationEmailId(email._id));
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <CompilationNav compilationId={this.props.params.id} currentPage="edit-emails" />
        <div className="container">
          <h1>Edit Compilation Emails</h1>
          <div className="row">
            <div className="col-md-3">
              <CompilationEmailsList
                emails={this.props.compilationEmails}
                selectedEmailId={this.selectedCompilationEmail._id}
                setSelectedCompilationEmail={this.setSelectedCompilationEmail}
              />
            </div>
            <div className="col-md-9">
              <CompilationEmailPreview email={this.selectedCompilationEmail} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CompilationAddEmailsContainer.need = [
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
  };
}

CompilationAddEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationAddEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationAddEmailsContainer);
