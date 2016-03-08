import React, { Component, PropTypes } from 'react';

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitLogin = this.submitLogin.bind(this);
  }

  submitLogin() {
    const emailRef = this.refs.email;
    const passwordRef = this.refs.password;
    if (emailRef.value && passwordRef.value) {
      this.props.submitLogin(emailRef.value, passwordRef.value);
      emailRef.value = passwordRef.value = '';
    }
  }

  render() {
    return <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
      <h1>Login</h1>
      {this.renderForm()}
    </div>
  }
  renderForm() {
    return <form>
      {this.renderEmailFormGroup()}
      {this.renderPasswordFormGroup()}
      <button className="btn btn-success btn-block" onClick={this.submitLogin}>Login</button>
    </form>
  }
  renderEmailFormGroup() {
    return <div className="form-group">
      <label htmlFor="login-email">Email</label>
        <div className="input-group">
          <span className="input-group-addon">@</span>
          <input
            ref="email"
            id="login-email"
            className="form-control"
            type="text"
            placeholder="john@example.com"
            />
        </div>
    </div>
  }
  renderPasswordFormGroup() {
    return <div className="form-group">
      <label htmlFor="login-password">Password</label>
      <input
        ref="password"
        className="form-control"
        type="password"
        id="login-password"
        />
    </div>
  }
}

LoginForm.propTypes = {
  submitLogin: PropTypes.func.isRequired,
};

LoginForm.propTypes = {};

export default LoginForm;
