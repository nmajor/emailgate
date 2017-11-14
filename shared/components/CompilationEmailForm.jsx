import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import EmailTemplate from '../templates/book/email';
import Loading from './Loading';
// import FixedFooter from './FixedFooter';

class CompilationEmailForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.template = new EmailTemplate(this.props.email);
    this.state = this.template.initialFormState();
    this.setBodyState = this.setBodyState.bind(this);
    this.setFormState = this.setFormState.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.rotateAttachment = this.rotateAttachment.bind(this);
    this.addAttachment = this.addAttachment.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.template = new EmailTemplate(nextProps.email);
    this.state = this.template.initialFormState();
  }
  componentWillUpdate(nextProps, nextState) {
    this.template = new EmailTemplate(nextState);
    this.state = this.template.initialFormState();
  }
  setBodyState(newVal) {
    const newState = { body: newVal };
    this.setState(newState);
  }
  setFormState(event, newState) {
    if (event) {
      newState = {}; // eslint-disable-line no-param-reassign
      newState[event.target.getAttribute('name')] = event.target.innerHTML; // eslint-disable-line no-param-reassign
    }
    this.setState(newState);
  }
  rotateAttachment(attachmentContentId) {
    this.props.rotateAttachment(this.props.email._id, attachmentContentId);
  }
  addAttachment(attachment) {
    const attachments = [
      ...this.props.email.attachments,
      attachment,
    ];

    this.setState({ attachments });
    this.props.submitForm({ attachments });
  }
  submitForm(e) {
    if (e) { e.preventDefault(); }

    this.props.submitForm(this.state);
  }
  renderForm() {
    if (this.template) {
      return this.template.renderForm(this.setFormState, this.setBodyState, {
        rotateAttachment: this.rotateAttachment,
        addAttachment: this.addAttachment,
      });
    }
  }
  renderErrors(type) {
    if (this.props.email.errors) {
      return this.props.email.errors[type].map((error, index) => {
        return <p key={index} className="text-danger">{error}</p>;
      });
    }
  }
  renderSaving() {
    if (this.props.email.saving) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  render() {
    return (<div>
      <form className="email-form" onSubmit={this.handleSubmit}>
        <div className="email-view">
          <div className="email-container">
            {this.renderForm()}
          </div>
        </div>

        {this.renderErrors('base')}
      </form>
    </div>);
  }
}

CompilationEmailForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEmailForm.propTypes = {
  email: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  rotateAttachment: PropTypes.func.isRequired,
};

export default CompilationEmailForm;
