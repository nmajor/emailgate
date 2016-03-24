import React, { PropTypes, Component } from 'react';
import CompilationEmailNav from '../components/CompilationEmailNav';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class ViewCompilationEmailsContainer extends Component {
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
          <CompilationEmailNav email={this.props.currentEmail} currentPage="preview" removeEmail={this.removeEmail} />
          PDF Preview here
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

ViewCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(ViewCompilationEmailsContainer);
