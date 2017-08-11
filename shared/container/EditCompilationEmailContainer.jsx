import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';
import * as Actions from '../redux/actions/index';

class EditCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.save = this.save.bind(this);
    this.rotateAttachment = this.rotateAttachment.bind(this);
    this.remove = this.remove.bind(this);

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
      remove: this.remove,
    };
  }
  rotateAttachment(emailId, attachmentContentId) {
    this.props.dispatch(Actions.rotateImageAttachment(this.props.compilation._id, emailId, attachmentContentId));
  }
  save(emailProps) {
    this.props.dispatch(Actions.updateCompilationEmail(this.currentEmail._compilation, this.currentEmail, emailProps));
  }
  remove() {
    if (window.confirm('Are you sure you want to delete this email?')) { // eslint-disable-line no-alert
      this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, this.currentEmail));
      this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
    }
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentEmail={this.currentEmail} edit={this.save} rotateAttachment={this.rotateAttachment} componentProps={this.getComponentProps()} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

EditCompilationEmailContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditCompilationEmailContainer);
