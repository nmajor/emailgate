import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';

class ForgotPasswordForm extends Component {
  renderSubmitting() {
    if (this.props.submitting) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  renderErrorClass(field) {
    if (field.touched && field.error) {
      return 'has-error';
    }
  }
  renderError(field) {
    if (field.touched && field.error) {
      return <span className="help-block">{field.error}</span>;
    }
  }
  render() {
    const {
      fields: {
        email,
      },
      error,
      success,
      handleSubmit,
    } = this.props;

    return (<div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className={`form-group ${this.renderErrorClass(email)}`}>
              <label className="control-label">Email</label>
              <input type="text" className="form-control" {...email} />
              {this.renderError(email)}
            </div>
          </div>
        </div>
        <div className="form-group">
          {error && <div className="text-danger">{error}</div>}
          <button className="btn btn-success" type="submit">Submit</button>
          {this.renderSubmitting()}
          {success && <span className="text-success">{success}</span>}
        </div>
      </form>
    </div>);
  }
}

ForgotPasswordForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

ForgotPasswordForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'forgotPassword',
  fields: [
    'email',
  ],
})(ForgotPasswordForm);

export default ForgotPasswordForm;
