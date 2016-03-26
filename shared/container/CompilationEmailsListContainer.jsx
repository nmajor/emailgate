import React, { PropTypes, Component } from 'react';
import CompilationEmailsList from '../components/CompilationEmailsList';
import { connect } from 'react-redux';

class CompilationEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <CompilationEmailsList
        emails={this.props.compilationEmails}
        currentEmailId={this.props.currentEmailId}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

CompilationEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentEmailId: PropTypes.string,
};

export default connect(mapStateToProps)(CompilationEmailsListContainer);
