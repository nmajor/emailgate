import React, { PropTypes, Component } from 'react';
import CompilationEmailNav from '../components/CompilationEmailNav';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class CompilationEmailNavContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.removeEmail = this.removeEmail.bind(this);
  }
  removeEmail() {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, this.props.currentEmail));
  }
  render() {
    return <CompilationEmailNav email={this.props.currentEmail} active={this.props.active} removeEmail={this.removeEmail} />;
  }
}

CompilationEmailNavContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
};

export default connect()(CompilationEmailNavContainer);
