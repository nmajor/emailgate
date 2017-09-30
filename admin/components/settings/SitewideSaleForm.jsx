import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
// import _ from 'lodash';

class SitewideSaleForm extends Component { // eslint-disable-line
  render() {
    const {
      fields: {
        code,
        desc,
        discount,
      },
      error,
      submitting,
      handleSubmit,
    } = this.props;

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Promo Code</label>
            <input type="text" className="form-control" {...code} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Discount</label>
            <input type="number" className="form-control" {...discount} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Message</label>
            <input type="text" className="form-control" {...desc} />
          </div>
        </div>
      </div>
      <div className="form-group text-right">
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-success marginless-right" type="submit">Submit</button>
        {submitting && <div>saving</div>}
      </div>
    </form>);
  }
}

SitewideSaleForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

const form = compose(
  connect((state, props) => ({ form: `setting-${props.setting.name}` })),
  reduxForm({ // eslint-disable-line no-class-assign
    form: 'screencastHelp',
    fields: [
      'code',
      'desc',
      'discount',
    ],
  })
)(SitewideSaleForm);

export default form;
