import React, { PropTypes, Component } from 'react';
import CompilationEmailsList from '../components/CompilationEmailsList';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class CompilationEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.setCurrentCompilationEmail = this.setCurrentCompilationEmail.bind(this);
  }

  setCurrentCompilationEmail(email) {
    this.props.dispatch(Actions.setEditingCurrentCompilationEmail(false));
    this.props.dispatch(Actions.setCurrentCompilationEmailId(email._id));
  }

  render() {
    return (
      <CompilationEmailsList
        emails={this.props.compilationEmails}
        selectedEmailId={this.props.currentCompilationEmailId}
        setCurrentCompilationEmail={this.setCurrentCompilationEmail}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    currentCompilationEmailId: store.currentCompilationEmailId,
  };
}

CompilationEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentCompilationEmailId: PropTypes.string,
};

export default connect(mapStateToProps)(CompilationEmailsListContainer);
