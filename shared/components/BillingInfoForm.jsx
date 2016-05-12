import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';
import Card from 'react-credit-card';
import _ from 'lodash';

class BillingInfoForn extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      focused: 'number',
    };

    this.setFocusedValue = this.setFocusedValue.bind(this);
  }
  setFocusedValue(event) {
    console.log(event.target);
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;

    this.setState(newState);
  }
  getFocusedFromActiveField(activeField) {
    const focusedMap = {
      expMonth: 'expiry',
      expYear: 'expiry',
    };

    if (focusedMap[activeField.name]) {
      return focusedMap[activeField.name];
    }

    return activeField.name;
  }
  renderSubmitting(submitting) {
    if (submitting) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  render() {
    const {
      fields: {
        number,
        expMonth,
        expYear,
        cvc,
      },
      handleSubmit,
      submitting,
      billingAddress,
    } = this.props;

    const activeField = _.find(this.props.fields, (field) => { return field.active === true; }) || {};
    const billingName = (billingAddress.firstName && billingAddress.lastName) ? `${billingAddress.firstName} ${billingAddress.lastName}` : '';

    return (<div>
      <div>
        <Card
          number={number.value}
          expiry={`${expMonth.value}${expYear.value}`}
          cvc={cvc.value}
          name={billingName}
          focused={this.getFocusedFromActiveField(activeField)}
        />
      </div>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-group">
                    <input type="text" className="form-control" data-focused="number" onFocus={this.setFocusedValue} {...number}/>
                    <span className="input-group-addon"><span className="glyphicon glyphicon-credit-card" aria-hidden="true"></span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Exp Month</label>
                  <input type="text" className="form-control" onFocus={this.setFocusedValue} {...expMonth}/>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Exp Year</label>
                  <input type="text" className="form-control" onFocus={this.setFocusedValue} {...expYear}/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" className="form-control" onFocus={this.setFocusedValue} {...cvc}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <button className="btn btn-success" type="submit">Submit</button>
              {this.renderSubmitting(submitting)}
            </div>
          </form>
        </div>
      </div>
    </div>);
  }
}

BillingInfoForn.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  billingAddress: PropTypes.object.isRequired,
};

BillingInfoForn = reduxForm({
  form: 'billingInfo',
  fields: [
    'number',
    'expMonth',
    'expYear',
    'cvc',
  ],
})(BillingInfoForn);

export default BillingInfoForn;
