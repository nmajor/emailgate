import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.emails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails());
    }
  }

  render() {
    return (
      <div className="compilation-emails-container">
        <h3>CompilationEmailsContainer</h3>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    emails: store.compilationEmails,
  };
}

CompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  emails: PropTypes.array,
};

export default connect(mapStateToProps)(CompilationEmailsContainer);
