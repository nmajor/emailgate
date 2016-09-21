import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';
import * as Actions from '../redux/actions/index';

class ViewCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
    if (this.props.params.emailId) {
      this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.emailId) {
      this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
    }
  }
  getComponentProps() {
    return {
      remove: this.removeEmail,
    };
  }
  removeEmail() {
    if (window.confirm('Are you sure you want to delete this email?')) { // eslint-disable-line no-alert
      this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, this.currentEmail));
    }
  }
  render() {
    return <CompilationBuildContainer componentProps={this.getComponentProps()} compilation={this.props.compilation} currentEmail={this.currentEmail} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

ViewCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationEmailContainer);
