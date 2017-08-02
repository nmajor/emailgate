import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Loading from './Loading';

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(e) {
    e.preventDefault();

    const emailRef = this.refs.email;
    const passwordRef = this.refs.password;
    if (emailRef.value && passwordRef.value) {
      this.props.loginUser(emailRef.value, passwordRef.value);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  renderLoading() {
    if (this.props.user.loggingIn) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderForm() {
    return (<form onSubmit={this.handleSubmit}>
      {this.renderEmailFormGroup()}
      {this.renderPasswordFormGroup()}
      {this.renderErrors('base')}
      <button className="btn btn-success btn-block" onClick={this.loginUser}>
        Login {this.renderLoading()}
      </button>
      <div className="top-bumper actions">
        <Link to="/forgot">Forgot password?</Link>
      </div>
    </form>);
  }
  renderEmailFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          ref="email"
          id="login-email"
          className="form-control"
          type="text"
        />
      </div>
    );
  }
  renderPasswordFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          ref="password"
          className="form-control"
          type="password"
          id="login-password"
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
    return this.renderForm();
  }
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  user: PropTypes.object,
};

export default LoginForm;
