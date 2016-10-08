import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class RegisterForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.registerUser = this.registerUser.bind(this);
  }

  registerUser(e) {
    e.preventDefault();

    const nameRef = this.refs.name;
    const emailRef = this.refs.email;
    const passwordRef = this.refs.password;
    if (nameRef.value && emailRef.value && passwordRef.value) {
      this.props.registerUser(nameRef.value, emailRef.value, passwordRef.value);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  renderLoading() {
    if (this.props.user.registering) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderNameFormGroup()}
        {this.renderEmailFormGroup()}
        {this.renderPasswordFormGroup()}
        {this.renderErrors('base')}
        <button className="btn btn-success btn-block" onClick={this.registerUser}>
          Register {this.renderLoading()}
        </button>
      </form>
    );
  }
  renderNameFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="register-name">Name</label>
        <input
          ref="name"
          id="register-name"
          className="form-control"
          type="text"
        />
      </div>
    );
  }
  renderEmailFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          ref="email"
          id="register-email"
          className="form-control"
          type="text"
        />
      </div>
    );
  }
  renderPasswordFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          ref="password"
          className="form-control"
          type="password"
          id="register-password"
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
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <h1>Register</h1>
        {this.renderForm()}
      </div>
    );
  }
}

RegisterForm.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
  user: PropTypes.object,
};

export default RegisterForm;
