import React, { Component, PropTypes } from 'react';

class AccountForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { savable: false };

    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
    this.setSaveAbility = this.setSaveAbility.bind(this);
  }
  componentDidMount() {
    this.setSaveAbility();
  }
  setSaveAbility() {
    const email = this.refs.email.val;
    const password = this.refs.password.val;
    const host = this.refs.host.val;
    const port = this.refs.port.val;

    if (
      email !== this.props.account.email &&
      password !== this.props.account.password &&
      host !== this.props.account.host &&
      port !== this.props.account.port
    ) {
      this.setState({ savable: true });
    } else {
      this.setState({ savable: false });
    }
  }
  submitForm(e) {
    e.preventDefault();
    if (!this.state.savable) { return; }

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
  back(e) {
    e.preventDefault();
    this.props.back();
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderEmailFormGroup()}
        {this.renderPasswordFormGroup()}
        {this.renderHostFormGroup()}
        {this.renderPortFormGroup()}
        {this.renderValidatedStatus()}
        {this.renderErrors('base')}
        <button className={`btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>Save</button>
        <button className="btn btn-danger left-bumper" onClick={this.back}>Back</button>
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
              defaultValue={this.props.account.email}
              onChange={this.setSaveAbility}
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
          defaultValue={this.props.account.password}
          onChange={this.setSaveAbility}
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
          defaultValue={this.props.account.host}
          placeholder="imap.example.com"
          onChange={this.setSaveAbility}
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
          defaultValue={this.props.account.port}
          placeholder="993"
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
  renderValidatedStatus() {
    if (this.props.account.validating) {
      return <div>validating ...</div>;
    } else if (this.props.account.validatedAt >= this.props.account.updatedAt) {
      return <div>validated</div>;
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
  account: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default AccountForm;
