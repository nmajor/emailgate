import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';
// import Card from 'react-credit-card';
import _ from 'lodash';

class BillingInfoForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      focused: 'number',
    };
  }
  getFocusedFromActiveField(activeField) {
    const focusedMap = {
      exp_Month: 'expiry',
      exp_year: 'expiry',
    };

    if (focusedMap[activeField.name]) {
      return focusedMap[activeField.name];
    }

    return activeField.name;
  }
  renderSubmitting() {
    if (this.props.submitting) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  renderRangedOptions(min, max) {
    return _.map(_.range(min, max + 1), (num, index) => { return <option key={index} value={num}>{num}</option>; });
  }
  renderCardErrors() {
    let errors = [];

    if (!_.isEmpty(this.props.cardErrors)) {
      errors = _.map(this.props.cardErrors, (val, key) => {
        return <div key={key}>{val}</div>;
      });
    }

    if (errors.length > 0) {
      return (<div className="form-group text-danger">
        {errors}
      </div>);
    }
  }
  render() {
    const {
      fields: {
        number,
        exp_month,
        exp_year,
        cvc,
      },
      submitting,
      handleSubmit,
      // billingAddress,
    } = this.props;

    // const activeField = _.find(this.props.fields, (field) => { return field.active === true; }) || {};
    // const billingName = (billingAddress.firstName && billingAddress.lastName) ? `${billingAddress.firstName} ${billingAddress.lastName}` : '';

    /* eslint-disable camelcase */
    return (<div>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-group">
                    <input type="text" className="form-control" {...number} />
                    <span className="input-group-addon"><span className="glyphicon glyphicon-credit-card" aria-hidden="true"></span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <div className="form-group">
                  <label>Exp Month</label>
                  <select type="text" className="form-control" {...exp_month}>
                    {this.renderRangedOptions(1, 12, exp_month.value)}
                  </select>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <label>Exp Year</label>
                  <select type="text" className="form-control" {...exp_year}>
                    {this.renderRangedOptions(new Date().getFullYear(), (new Date().getFullYear()) + 10, exp_year)}
                  </select>
                </div>
              </div>
              <div className="col-md-3" />
              <div className="col-sm-3">
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" className="form-control" {...cvc} />
                </div>
              </div>
            </div>
            {this.renderCardErrors()}
            <div className="form-group text-right">
              <button className="btn btn-success marginless-right" type="submit" disabled={submitting}>Submit</button>
              {this.renderSubmitting()}
            </div>
          </form>
        </div>
      </div>
    </div>);
    /* eslint-enable */
  }
}

BillingInfoForm.propTypes = {
  fields: PropTypes.object.isRequired,
  cardErrors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  // billingAddress: PropTypes.object.isRequired,
};

BillingInfoForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'billingInfo',
  fields: [
    'number',
    'exp_month',
    'exp_year',
    'cvc',
  ],
})(BillingInfoForm);

export default BillingInfoForm;
