import React, { PropTypes, Component } from 'react';
import CompilationEmailsList from '../components/CompilationEmailsList';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class CompilationEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.setSelectedCompilationEmail = this.setSelectedCompilationEmail.bind(this);
  }

  setSelectedCompilationEmail(email) {
    this.props.dispatch(Actions.setEditingSelectedCompilationEmail(false));
    this.props.dispatch(Actions.setSelectedCompilationEmailId(email._id));
  }

  render() {
    return (
      <CompilationEmailsList
        emails={this.props.compilationEmails}
        selectedEmailId={this.props.selectedCompilationEmailId}
        setSelectedCompilationEmail={this.setSelectedCompilationEmail}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    selectedCompilationEmailId: store.selectedCompilationEmailId,
  };
}

CompilationEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
};

export default connect(mapStateToProps)(CompilationEmailsListContainer);
