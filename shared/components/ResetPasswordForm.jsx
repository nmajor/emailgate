import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import Loading from './Loading';

class ResetPasswordForm extends Component {
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
        newPassword,
        newPasswordConfirm,
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
            <div className={`form-group ${this.renderErrorClass(newPassword)}`}>
              <label className="control-label">New Password</label>
              <input type="password" className="form-control" {...newPassword} />
              {this.renderError(newPassword)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className={`form-group ${this.renderErrorClass(newPasswordConfirm)}`}>
              <label className="control-label">Confirm New Password</label>
              <input type="password" className="form-control" {...newPasswordConfirm} />
              {this.renderError(newPasswordConfirm)}
            </div>
          </div>
        </div>
        <div className="form-group">
          <button className="btn btn-success" type="submit">Submit</button>
          {this.renderSubmitting()}
          <span className="left-bumper">
            {error && <div className="text-danger">{error}</div>}
            {success && <span className="text-success">{success}</span>}
          </span>
          <div className="top-bumper">
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </form>
    </div>);
  }
}

ResetPasswordForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

ResetPasswordForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'resetPassword',
  fields: [
    'newPassword',
    'newPasswordConfirm',
  ],
})(ResetPasswordForm);

export default ResetPasswordForm;
