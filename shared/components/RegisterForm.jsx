import React, { Component, PropTypes } from 'react';

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
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderNameFormGroup()}
        {this.renderEmailFormGroup()}
        {this.renderPasswordFormGroup()}
        {this.renderErrors('base')}
        <button className="btn btn-success btn-block" onClick={this.registerUser}>Register</button>
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
            placeholder="John Doe"
          />
      </div>
    );
  }
  renderEmailFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
          <div className="input-group">
            <span className="input-group-addon">@</span>
            <input
              ref="email"
              id="register-email"
              className="form-control"
              type="text"
              placeholder="john@example.com"
            />
          </div>
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
      return this.props.errors[type].map((error) => {
        return <p className="text-danger">{error}</p>;
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
};

export default RegisterForm;
