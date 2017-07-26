import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';
import _ from 'lodash';

class AddressForm extends Component {
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
  renderStateOptions() {
    return _.map(this.props.states, (val, key) => {
      return <option key={key} value={key}>{val}</option>;
    });
  }
  render() {
    const {
      fields: {
        firstName,
        lastName,
        address1,
        address2,
        city,
        region,
        postalCode,
        phone,
      },
      error,
      handleSubmit,
      back,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className={`form-group ${this.renderErrorClass(firstName)}`}>
            <label className="control-label">First Name</label>
            <input type="text" className="form-control" {...firstName} />
            {this.renderError(firstName)}
          </div>
        </div>
        <div className="col-md-6">
          <div className={`form-group ${this.renderErrorClass(lastName)}`}>
            <label className="control-label">Last Name</label>
            <input type="text" className="form-control" {...lastName} />
            {this.renderError(lastName)}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className={`form-group ${this.renderErrorClass(address1)}`}>
            <label className="control-label">Address</label>
            <input type="text" className="form-control" {...address1} />
            {this.renderError(address1)}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className={`form-group ${this.renderErrorClass(address2)}`}>
            <input type="text" className="form-control" {...address2} />
            {this.renderError(address2)}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className={`form-group ${this.renderErrorClass(city)}`}>
            <label className="control-label">City</label>
            <input type="text" className="form-control" {...city} />
            {this.renderError(city)}
          </div>
        </div>
        <div className="col-md-3">
          <div className={`form-group ${this.renderErrorClass(region)}`}>
            <label className="control-label">State/Region</label>
            <select className="form-control" {...region} value={region.value || ''}>
              <option value="">- State</option>
              {this.renderStateOptions()}
            </select>
            {this.renderError(region)}
          </div>
        </div>
        <div className="col-md-3">
          <div className={`form-group ${this.renderErrorClass(postalCode)}`}>
            <label className="control-label">Postal Code</label>
            <input type="text" className="form-control" {...postalCode} />
            {this.renderError(postalCode)}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className={`form-group ${this.renderErrorClass(phone)}`}>
            <label className="control-label">Phone Number</label>
            <input type="text" className="form-control" {...phone} />
            {this.renderError(phone)}
          </div>
        </div>
      </div>
      <div className="text-right">
        {error && <div className="text-danger">{error}</div>}
        {back && <div className="btn btn-danger right-bumper" onClick={back}>Back</div>}
        <button className="btn btn-success marginless-right" type="submit">Submit Address</button>
        {this.renderSubmitting()}
      </div>
    </form>);
  }
}

AddressForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  back: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  states: PropTypes.object.isRequired,
};

AddressForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'address',
  fields: [
    'firstName',
    'lastName',
    'address1',
    'address2',
    'city',
    'region',
    'postalCode',
    'phone',
  ],
})(AddressForm);

export default AddressForm;
