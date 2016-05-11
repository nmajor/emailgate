import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';

class AddressForm extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderSubmitting(submitting) {
    if (submitting) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
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
      handleSubmit,
      back,
      submitting,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>First Name</label>
        <input type="text" className="form-control" {...firstName}/>
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input type="text" className="form-control" {...lastName}/>
      </div>
      <div className="form-group">
        <label>Address</label>
        <input type="text" className="form-control" {...address1}/>
      </div>
      <div className="form-group">
        <input type="text" className="form-control" {...address2}/>
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" className="form-control" {...city}/>
      </div>
      <div className="form-group">
        <label>State</label>
        <input type="text" className="form-control" {...region}/>
      </div>
      <div className="form-group">
        <label>Postal Code</label>
        <input type="text" className="form-control" {...postalCode}/>
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="text" className="form-control" {...phone}/>
      </div>
      <div className="form-group">
        <div className="btn btn-danger right-bumper" onClick={back}>Back</div>
        <button className="btn btn-success" type="submit">Submit</button>
        {this.renderSubmitting(submitting)}
      </div>
    </form>);
  }
}

AddressForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

AddressForm = reduxForm({
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
