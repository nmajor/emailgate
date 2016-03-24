import React, { PropTypes, Component } from 'react';
import CompilationEmailNav from '../components/CompilationEmailNav';
import CompilationEmailFormContainer from './CompilationEmailFormContainer';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class EditCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  removeEmail() {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, this.props.currentEmail));
  }
  renderPreview() {
    if (this.props.currentEmail) {
      return (
        <div>
          <CompilationEmailNav email={this.props.currentEmail} currentPage="edit" removeEmail={this.removeEmail} />
          <CompilationEmailFormContainer compilation={this.props.compilation} email={this.props.currentEmail} />
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

EditCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(EditCompilationEmailsContainer);
