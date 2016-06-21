import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';

class UpdatePasswordForm extends Component {
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
        currentPassword,
        newPassword,
        newPasswordConfirm,
      },
      error,
      success,
      handleSubmit,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className={`form-group ${this.renderErrorClass(currentPassword)}`}>
            <label className="control-label">Current Password</label>
            <input type="password" className="form-control" {...currentPassword} />
            {this.renderError(currentPassword)}
          </div>
        </div>
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
      </div>
    </form>);
  }
}

UpdatePasswordForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

UpdatePasswordForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'updatePassword',
  fields: [
    'currentPassword',
    'newPassword',
    'newPasswordConfirm',
  ],
})(UpdatePasswordForm);

export default UpdatePasswordForm;
