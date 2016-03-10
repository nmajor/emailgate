import React, { Component, PropTypes } from 'react';

class AccountForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
  }

  submitForm(e) {
    e.preventDefault();

    const emailRef = this.refs.email;
    const passwordRef = this.refs.password;
    const hostRef = this.refs.host;
    const portRef = this.refs.port;

    if (emailRef.value && passwordRef.value && hostRef.value && portRef.value) {
      this.props.submitForm({
        email: emailRef.value,
        password: passwordRef.value,
        host: hostRef.value,
        port: portRef.value,
      });
    }
  }
  cancelForm(e) {
    e.preventDefault();
    this.props.cancelForm();
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderEmailFormGroup()}
        {this.renderPasswordFormGroup()}
        {this.renderHostFormGroup()}
        {this.renderPortFormGroup()}
        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Save</button>
        <button className="btn btn-danger left-bumper" onClick={this.cancelForm}>Cancel</button>
      </form>
    );
  }
  renderEmailFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-email">Email</label>
          <div className="input-group">
            <span className="input-group-addon">@</span>
            <input
              ref="email"
              id="account-email"
              className="form-control"
              type="text"
              placeholder="john@example.com"
              value={`${Date.now()}@gmail.com`}
            />
          </div>
      </div>
    );
  }
  renderPasswordFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-password">Password</label>
        <input
          ref="password"
          className="form-control"
          type="password"
          id="account-password"
          value="SuperHappy123"
        />
      </div>
    );
  }
  renderHostFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-host">Host</label>
        <input
          ref="host"
          className="form-control"
          type="text"
          id="account-host"
          value="imap.google.com"
          placeholder="imap.example.com"
        />
      </div>
    );
  }
  renderPortFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-port">Port</label>
        <input
          ref="port"
          className="form-control"
          type="text"
          id="account-port"
          value="993"
          placeholder="993"
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

AccountForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default AccountForm;
