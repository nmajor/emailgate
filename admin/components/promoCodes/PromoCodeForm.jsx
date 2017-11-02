import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import DatePicker from 'react-datepicker';
// import _ from 'lodash';

class PromoCodeForm extends Component { // eslint-disable-line
  constructor(props) {
    super(props);

    this.state = {
      kind: 'discount',
    };
  }
  renderVoucherForm() {
    const {
      fields: {
        premiumColorVoucherQuantity,
        standardColorVoucherQuantity,
        bwColorVoucherQuantity,
        email,
      },
    } = this.props;

    return (<div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Premium Color Quantity</label>
            <input type="text" className="form-control" {...premiumColorVoucherQuantity} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Standard Color Quantity</label>
            <input type="text" className="form-control" {...standardColorVoucherQuantity} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Black & White Quantity</label>
            <input type="text" className="form-control" {...bwColorVoucherQuantity} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Email</label>
            <input type="text" className="form-control" {...email} />
          </div>
        </div>
      </div>
    </div>);
  }
  renderDiscountForm() {
    const {
      fields: {
        discount,
        expiresAt,
        oneTimeUse,
        freeShipping,
      },
    } = this.props;

    return (<div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Discount</label>
            <input type="text" className="form-control" {...discount} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Expires At</label>
            <DatePicker
              className="form-control"
              {...expiresAt}
              name="Start Date"
              showYearDropdown
              fixedHeight
              dateFormat="YYYY/M/D"
              minDate={moment(new Date, 'YYYY/M/D')}
              selected={expiresAt.value ? moment(expiresAt.value, 'YYYY/M/D') : null}
              onChange={(params) => { expiresAt.onChange(params); }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="checkbox">
            <label className="control-label"><input type="checkbox" {...oneTimeUse} /> One Time Use</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="checkbox">
            <label className="control-label"><input type="checkbox" {...freeShipping} /> Free Shipping</label>
          </div>
        </div>
      </div>
    </div>);
  }
  renderForm() {
    if (this.state.kind === 'discount') {
      return this.renderDiscountForm();
    }

    return this.renderVoucherForm();
  }
  renderFormOption(kind) {
    return (<div className={`btn btn-block btn-${kind === this.state.kind ? 'primary' : 'default'}`} onClick={() => { this.setState({ kind }); }}>{kind}</div>);
  }
  render() {
    const {
      fields: {
        code,
      },
      error,
      handleSubmit,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="control-label">Code</label>
                <input type="text" className="form-control" {...code} />
                <div className="help-block">Leave blank for auto generate</div>
              </div>
            </div>
          </div>
          <div className="row bottom-bumper">
            <div className="col-xs-6">{this.renderFormOption('discount')}</div>
            <div className="col-xs-6">{this.renderFormOption('voucher')}</div>
          </div>
          {this.renderForm()}
          <div className="form-group text-right">
            {error && <div className="text-danger">{error}</div>}
            <button className="btn btn-success marginless-right" type="submit">Submit</button>
          </div>
        </div>
      </div>
    </form>);
  }
}

PromoCodeForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

PromoCodeForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'address',
  fields: [
    'code',
    'discount',
    'expiresAt',
    'oneTimeUse',
    'freeShipping',
    'premiumColorVoucherQuantity',
    'standardColorVoucherQuantity',
    'bwColorVoucherQuantity',
  ],
})(PromoCodeForm);

export default PromoCodeForm;
