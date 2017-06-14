import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import DatePicker from 'react-datepicker';
// import _ from 'lodash';

class PromoCodeForm extends Component { // eslint-disable-line
  render() {
    const {
      fields: {
        code,
        discount,
        expiresAt,
        oneTimeUse,
        freeShipping,
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
  ],
})(PromoCodeForm);

export default PromoCodeForm;
