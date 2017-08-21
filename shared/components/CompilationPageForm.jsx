import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import Loading from './Loading';
// import FixedFooter from './FixedFooter';

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
    if (e) { e.preventDefault(); }

    this.props.submitForm(this.state);
  }

  renderForm() {
    if (this.props.template) {
      return this.props.template.renderForm(this.setFormState);
    }
  }
  renderSaving() {
    if (this.props.page.saving) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  render() {
    return (<div>
      <div className="compilation-page">
        <div className="page-container">
          {this.renderForm()}
        </div>
      </div>
    </div>);
  }
}

CompilationPageForm.propTypes = {
  page: PropTypes.object.isRequired,
  template: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
};

export default CompilationPageForm;
