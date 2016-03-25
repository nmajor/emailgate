import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import EmailView from '../components/EmailView';
import { connect } from 'react-redux';

class ViewCompilationEmailsContainer extends Component {
  renderView() {
    if (this.props.currentEmail) {
      return (
        <div>
          <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} currentPage="view" />
          <EmailView email={this.props.currentEmail} />
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderView()}</div>;
  }
}

ViewCompilationEmailsContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
};

export default connect()(ViewCompilationEmailsContainer);