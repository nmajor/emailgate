import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class CompilationEmailForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    const subjectRef = this.refs.subject || {};
    const textRef = this.refs.text || {};

    this.props.submitForm({
      subject: subjectRef.value,
      text: textRef.value,
    });
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderSubjectFormGroup()}
        {this.renderTextFormGroup()}

        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Save</button>
        <span className="left-bumper">{this.renderSaving()}</span>
      </form>
    );
  }
  renderSubjectFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="email-subject">Subject</label>
        <input
          ref="subject"
          className="form-control"
          type="text"
          id="email-subject"
          defaultValue={this.props.email.subject}
        />
      </div>
    );
  }
  renderTextFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="email-text">Subject</label>
        <textarea
          ref="text"
          className="form-control"
          id="email-text"
          defaultValue={this.props.email.text}
        ></textarea>
      </div>
    );
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
      return 'saving ...';
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          {this.props.email.saving}
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

CompilationEmailForm.propTypes = {
  email: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default CompilationEmailForm;
