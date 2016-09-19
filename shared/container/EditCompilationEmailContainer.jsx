import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';
import * as Actions from '../redux/actions/index';

class ViewCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.save = this.save.bind(this);

    if (this.props.params.emailId) {
      this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.emailId) {
      this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
    }
  }
  save(emailProps) {
    this.props.dispatch(Actions.updateCompilationEmail(this.currentEmail._compilation, this.currentEmail, emailProps));
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentEmail={this.currentEmail} edit={this.save} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

ViewCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationEmailContainer);
