import React, { Component, PropTypes } from 'react';

class FilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm({});
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>

        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Save</button>
        <span className="left-bumper">{this.renderSaving()}</span>
      </form>
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
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

FilterForm.propTypes = {
  email: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default FilterForm;
