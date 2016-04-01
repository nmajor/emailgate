import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationHeader from '../components/CompilationHeader';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationEmails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails(this.props.params.compilationId));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
  }
  renderEmailsLink() {
    return (<Link
      className="btn btn-primary btn-xs"
      to={`/compilations/${this.props.params.compilationId}/emails`}
    >
      Back to Emails ({this.props.compilationEmails.length})
    </Link>);
  }
  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <CompilationHeader compilation={this.compilation} />
        <div className="container">
          <h1>Add Emails to Compilation {this.renderEmailsLink()}</h1>
          <SelectAccountContainer />
          <FilterContainer />
          <FilteredAccountEmailsContainer compilation={this.compilation} />
        </div>
      </div>
    );
  }
}

AddCompilationEmailsContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationEmails.bind(null, params.compilationId, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
