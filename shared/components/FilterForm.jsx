import React, { Component, PropTypes } from 'react';

class FilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    const mailboxRef = this.refs.mailbox || {};
    const subjectRef = this.refs.subject || {};
    const toRef = this.refs.to || {};
    const fromRef = this.refs.from || {};

    this.props.submitForm({
      mailbox: mailboxRef.value,
      subject: subjectRef.value,
      to: toRef.value,
      from: fromRef.value,
    });
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderMailboxFormGroup()}
        {this.renderSubjectFormGroup()}
        {this.renderToFormGroup()}
        {this.renderFromFormGroup()}

        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Submit</button>
        <button className="btn btn-danger left-bumper" onClick={this.back}>Back</button>
      </form>
    );
  }
  renderSubjectFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="filter-subject">Subject</label>
        <input
          ref="subject"
          className="form-control"
          type="text"
          id="filter-subject"
          onChange={this.setSaveAbility}
          defaultValue="isaac"
        />
      </div>
    );
  }
  renderMailboxFormGroup() {
    return (<div className="form-group">
      <label htmlFor="filter-mailbox">Mailbox</label>
      <select
        ref="mailbox"
        className="form-control"
        id="filter-mailbox"
        onChange={this.setSaveAbility}
        defaultValue="[Gmail]/All Mail"
      >
        {this.renderMailboxOptions()}
      </select>
    </div>);
  }
  renderToFormGroup() {
    return (<div className="form-group">
      <label htmlFor="filter-to">To Email</label>
      <input
        ref="to"
        type="text"
        className="form-control"
        id="filter-to"
        onChange={this.setSaveAbility}
      />
    </div>);
  }
  renderFromFormGroup() {
    return (<div className="form-group">
      <label htmlFor="filter-from">From Email</label>
      <input
        ref="from"
        type="text"
        className="form-control"
        id="filter-from"
        onChange={this.setSaveAbility}
      />
    </div>);
  }
  renderMailboxOptions() {
    return this.props.mailboxes.map((mailbox, index) => {
      return <option value={mailbox} key={index}>{mailbox}</option>;
    });
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
  mailboxes: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default FilterForm;
