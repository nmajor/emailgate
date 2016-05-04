import React, { PropTypes, Component } from 'react';
import Loading from './Loading';

class CompilationPageForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.props.template.initialFormState();
    this.setFormState = this.setFormState.bind(this);
    this.submitForm = this.submitForm.bind(this);
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
    if (this.props.template) {
      return this.props.template.renderForm(this.setFormState);
    }
  }
  renderSaving() {
    if (this.props.page.saving) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  render() {
    return (
      <div>
        <h3>{this.props.page.desc}</h3>
        <div className="compilation-page">
          {this.renderForm()}
        </div>
        <button className="btn btn-success top-bumper" onClick={this.submitForm}>Save</button>
        <span className="left-bumper top-bumper">{this.renderSaving()}</span>
      </div>
    );
  }
}

CompilationPageForm.propTypes = {
  compilation: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  template: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
};

export default CompilationPageForm;
