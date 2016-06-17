import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import EmailView from '../components/EmailView';
import { connect } from 'react-redux';

class ViewCompilationEmailContainer extends Component {
  renderView() {
    if (this.props.currentEmail) {
      return (<div>
        <h3>{this.props.currentEmail.subject}</h3>
        <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} active="view" />
        <div className="tab-content">
          <EmailView email={this.props.currentEmail} />
        </div>
      </div>);
    }
  }

  render() {
    return <div>{this.renderView()}</div>;
  }
}

ViewCompilationEmailContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
};

export default connect()(ViewCompilationEmailContainer);
