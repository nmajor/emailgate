import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationEmailsListContainer from './CompilationEmailsListContainer';
import CompilationEmailMainContainer from './CompilationEmailMainContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import { Link } from 'react-router';

class CompilationEditEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.id }) || {};

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationEmails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails(this.props.params.id));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.id }) || {};
  }
  renderAddLink() {
    return (<Link
      className="btn btn-primary btn-xs"
      to={`/compilations/${this.props.params.id}/emails/add`}
    >
      Add Emails
    </Link>);
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <CompilationNav compilationId={this.props.params.id} currentPage="emails" />
        <div className="container">
          <h1>Compilation Emails ({this.props.compilationEmails.length}) {this.renderAddLink()}</h1>
          <div className="row">
            <div className="col-md-3">
              <CompilationEmailsListContainer compilation={this.compilation} />
            </div>
            <div className="col-md-9">
              <CompilationEmailMainContainer compilation={this.compilation} />
            </div>
          </div>
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
    currentCompilationEmailId: store.currentCompilationEmailId,
    editingCurrentCompilationEmail: store.editingCurrentCompilationEmail,
  };
}

CompilationEditEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEditEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  currentCompilationEmailId: PropTypes.string,
  editingCurrentCompilationEmail: PropTypes.bool.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationEditEmailsContainer);
