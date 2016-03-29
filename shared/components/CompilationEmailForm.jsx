import React, { Component, PropTypes } from 'react';
import ReactQuill from 'react-quill';
import * as emailTemplate from '../templates/email';

class CompilationEmailForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      subject: this.props.email.subject,
      body: this.props.email.body,
    };

    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm({
      subject: this.state.subject,
      body: this.state.body,
    });
  }
  handleSubjectChange(event) {
    this.setState({ subject: event.target.innerHTML });
  }
  handleBodyChange(newBody) {
    this.setState({ body: newBody });
  }
  renderForm() {
    return (
      <form className="email-form" onSubmit={this.handleSubmit}>
        <div className="email-view">
          {this.renderSubjectEditor()}
          {emailTemplate.renderDate(this.props.email.date)}
          {emailTemplate.renderFrom(this.props.email.from)}
          {emailTemplate.renderTo(this.props.email.to)}
          {this.renderBodyEditor()}
        </div>

        {this.renderErrors('base')}
        <button className="btn btn-success top-bumper" onClick={this.submitForm}>Save</button>
        <span className="left-bumper top-bumper">{this.renderSaving()}</span>
      </form>
    );
  }
  renderSubjectEditor() {
    const subjectInput = <div className="editable" contentEditable onBlur={this.handleSubjectChange}>{this.state.subject}</div>;

    return emailTemplate.renderSubject(subjectInput);
  }
  renderBodyEditor() {
    const bodyInput = <ReactQuill className="editable" toolbar={false} styles={false} value={this.state.body} onChange={this.handleBodyChange} />;

    return emailTemplate.renderBody(bodyInput);
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
