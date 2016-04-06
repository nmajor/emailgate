import React, { PropTypes, Component } from 'react';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;
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
      <div className="edit-account-container container">
        <h1>Add Emails to Compilation {this.renderEmailsLink()}</h1>
        <SelectAccountContainer />
        <FilterContainer />
        <FilteredAccountEmailsContainer compilation={this.compilation} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    compilationEmails: store.compilationEmails,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
