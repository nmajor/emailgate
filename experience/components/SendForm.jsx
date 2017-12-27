import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
// import _ from 'lodash';

class WebpageForm extends Component { // eslint-disable-line
  // constructor(props) {
  //   super(props);
  // }
  render() {
    const {
      fields: {
        returnAddress,
      },
      // submitting,
      // error,
      // handleSubmit,
    } = this.props;

    return (<form onSubmit={() => {}}>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Name</label>
            <input type="text" className="form-control" {...returnAddress.name} placeholder="Guatemala Guatemala City South Mission" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Address 1</label>
            <input type="text" className="form-control" {...returnAddress.address_1} />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Address 2</label>
            <input type="text" className="form-control" {...returnAddress.address_2} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">City</label>
            <input type="text" className="form-control" {...returnAddress.city} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">State</label>
            <input type="text" className="form-control" {...returnAddress.state} placeholder="" />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label className="control-label">Postal Code</label>
            <input type="text" className="form-control" {...returnAddress.postal_code} placeholder="" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label className="control-label">Country</label>
            <input type="text" className="form-control" {...returnAddress.country} placeholder="" />
          </div>
        </div>
      </div>
    </form>);
  }
}

WebpageForm.propTypes = {
  fields: PropTypes.object.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  // submitting: PropTypes.bool.isRequired,
};

WebpageForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'send',
  fields: [
    'returnAddress.name',
    'returnAddress.address_1',
    'returnAddress.address_2',
    'returnAddress.city',
    'returnAddress.state',
    'returnAddress.postal_code',
    'returnAddress.country',
  ],
})(WebpageForm);

export default WebpageForm;
