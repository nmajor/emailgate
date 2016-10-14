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
      return <span className="button-loading"><Loading /></span>;
    }
  }
  // renderAction() {
  //   if (this.props.submitForm) {
  //     return (<FixedFooter>
  //       <button className="btn btn-success" onClick={this.submitForm}>Save Page {this.renderSaving()}</button>
  //       <Link to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`} className="btn btn-danger">Back</Link>
  //     </FixedFooter>);
  //   }
  // }
  render() {
    return (<div>
      <div className="compilation-page">
        {this.renderForm()}
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
