import React, { Component, PropTypes } from 'react';

class AccountImapForm extends Component {
  constructor(props, context) {
    super(props, context);

    const authProps = this.props.account.authProps || {};
    this.state = {
      email: this.props.account.email,
      password: this.props.accountPassword,
      host: authProps.host,
      port: authProps.port,
      kind: 'imap',
    };

    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
    this.setFormState = this.setFormState.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.accountPassword) {
      this.setState({ password: nextProps.accountPassword });
      this.forceUpdate();
    }
  }
  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;
    this.setState(newState);
  }
  formChanged() {
    return true;
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm(this.state);
  }
  back(e) {
    e.preventDefault();
    this.props.back();
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderEmailFormGroup()}
        {this.renderHostFormGroup()}
        {this.renderPortFormGroup()}
        {this.renderPasswordFormGroup()}

        {this.renderErrors('base')}
        <button className={`btn btn-success ${this.formChanged() ? '' : 'disabled'}`} onClick={this.submitForm}>Save</button>
        <button className="btn btn-danger left-bumper" onClick={this.back}>Back</button>
      </form>
    );
  }
  // renderConnectionStatus() {
  //   if (this.props.checkConnection) {
  //     let status;
  //
  //     if (this.props.account.checkingConnection) {
  //       status = <span>Checking Connection ...</span>;
  //     } else if (this.props.account.connectionValid) {
  //       status = 'Connection works.';
  //     } else {
  //       status = 'Could not connect.';
  //     }
  //
  //     return (
  //       <div className="connection-status">
  //         <div className="form-group">
  //           {status}
  //           {this.renderRefreshButton()}
  //         </div>
  //       </div>
  //     );
  //   }
  // }
  renderRefreshButton() {
    if (!this.props.account.checkingConnection) {
      return <span className="glyphicon glyphicon-refresh left-bumper" onClick={this.props.checkConnection} aria-hidden="true"></span>;
    }
  }
  renderEmailFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-email">Email</label>
          <div className="input-group">
            <span className="input-group-addon">@</span>
            <input
              name="email"
              id="account-email"
              className="form-control"
              type="text"
              placeholder="john@example.com"
              value={this.state.email}
              onChange={this.setFormState}
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
          name="password"
          className="form-control"
          type="password"
          id="account-password"
          value={this.state.password}
          onChange={this.setFormState}
        />
      <p className="help-block">For security reasons, we never store your email password on our servers, so you may need to re-enter this later if you refresh the page.</p>
      </div>
    );
  }
  renderHostFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-host">Host</label>
        <input
          name="host"
          className="form-control"
          type="text"
          id="account-host"
          value={this.state.host}
          placeholder="imap.example.com"
          onChange={this.setFormState}
        />
      </div>
    );
  }
  renderPortFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="account-port">Port</label>
        <input
          name="port"
          className="form-control"
          type="text"
          id="account-port"
          value={this.state.port}
          placeholder="993"
          onChange={this.setFormState}
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

AccountImapForm.propTypes = {
  account: PropTypes.object,
  accountPassword: PropTypes.string,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  errors: PropTypes.object,
  checkConnection: PropTypes.func,
};

export default AccountImapForm;
