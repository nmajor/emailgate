import React, { Component, PropTypes } from 'react';
import ReactQuill from 'react-quill';

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
    this.setState({ subject: event.target.value });
  }
  handleBodyChange(newBody) {
    this.setState({ body: newBody });
  }
  renderForm() {
    return (
      <form className="email-form" onSubmit={this.handleSubmit}>
        {this.renderSubjectEditor()}
        {this.renderBodyEditor()}

        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Save</button>
        <span className="left-bumper">{this.renderSaving()}</span>
      </form>
    );
  }
  renderSubjectEditor() {
    return <h3 className="editable" contentEditable="true" handleChange={this.handleSubjectChange}>{this.state.subject}</h3>;
  }
  renderBodyEditor() {
    return <ReactQuill className="editable" toolbar={false} styles={false} value={this.state.body} onChange={this.handleBodyChange} />;
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
