import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import EmailTemplate from '../templates/email';
import Loading from './Loading';
import FixedFooter from './FixedFooter';

class CompilationEmailForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.template = new EmailTemplate(this.props.email);
    this.state = this.template.initialFormState();
    this.setBodyState = this.setBodyState.bind(this);
    this.setFormState = this.setFormState.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.template = new EmailTemplate(nextProps.email);
    this.state = this.template.initialFormState();
  }
  setBodyState(newVal) {
    const newState = { body: newVal };
    this.setState(newState);
  }
  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.innerHTML;
    this.setState(newState);
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm(this.state);
  }
  renderForm() {
    if (this.template) {
      return this.template.renderForm(this.setFormState, this.setBodyState);
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
  renderAction() {
    if (this.props.submitForm) {
      return (<FixedFooter>
        <button className="btn btn-success" onClick={this.submitForm}>Save Email {this.renderSaving()}</button>
        <Link to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`} className="btn btn-danger">Back</Link>
      </FixedFooter>);
    }
  }
  render() {
    return (<div>
      <form className="email-form" onSubmit={this.handleSubmit}>
        <div className="email-view">
          {this.renderForm()}
        </div>

        {this.renderErrors('base')}
        {this.renderAction()}
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
};

export default CompilationEmailForm;
