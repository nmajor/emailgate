import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import CompilationEmailFormContainer from './CompilationEmailFormContainer';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class EditCompilationEmailContainer extends Component {
  removeEmail() {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, this.props.currentEmail));
  }
  renderPreview() {
    if (this.props.currentEmail) {
      return (<div>
        <h3>{this.props.currentEmail.subject}</h3>
        <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} active="edit" />
        <div className="tab-content">
          <CompilationEmailFormContainer compilation={this.props.compilation} email={this.props.currentEmail} />
        </div>
      </div>);
    }
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

EditCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(EditCompilationEmailContainer);
