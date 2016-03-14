import React, { Component, PropTypes } from 'react';

class FilterForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { savable: false };

    this.submitForm = this.submitForm.bind(this);
    this.setSaveAbility = this.setSaveAbility.bind(this);
  }
  componentDidMount() {
    this.setSaveAbility();
  }
  setSaveAbility() {
    if (this.formChanged()) {
      this.setState({ savable: true });
    } else {
      this.setState({ savable: false });
    }
  }
  formChanged() {
    const subjectRef = this.refs.subject || {};

    if (
      subjectRef.value !== this.props.filter.subject
    ) {
      return true;
    }
    return false;
  }
  submitForm(e) {
    e.preventDefault();
    if (!this.state.savable) { return; }

    const subjectRef = this.refs.subject || {};

    this.props.submitForm({
      subject: subjectRef.value,
    });
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderSubjectFormGroup()}

        {this.renderErrors('base')}
        <button className={`btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>Save</button>
        <button className="btn btn-danger left-bumper" onClick={this.back}>Back</button>
      </form>
    );
  }
  renderSubjectFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="filter-subject">Host</label>
        <input
          ref="subject"
          className="form-control"
          type="text"
          id="filter-subject"
          defaultValue={this.props.filter.subject}
          onChange={this.setSaveAbility}
        />
      </div>
    );
  }
  renderErrors(type) {
    if (this.props.errors) {
      return this.props.errors[type].map((error, index) => {
        return <p key={index} className="text-danger">{error}</p>;
      });
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-sm-8">
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

FilterForm.propTypes = {
  filter: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default FilterForm;
