import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import _ from 'lodash';

class WebpageForm extends Component { // eslint-disable-line
  constructor(props) {
    super(props);

    this.state = {
      kind: 'discount',
    };
  }
  render() {
    const {
      fields: {
        slug,
        webpageTitle,
        startingDate,
        endingDate,
      },
      error,
      handleSubmit,
    } = this.props;

    const slugPlaceholder = 'elderjohnjohnson';

    return (<form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Page Title</label>
            <input type="text" className="form-control" {...webpageTitle} placeholder="Elder John Johnson's Mission" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Subdomain</label>
            <input type="text" className="form-control" {...slug} placeholder={slugPlaceholder} />
            <div className="help-block">Pleople will be able to access your webpage by going to:<br />{slug.value || slugPlaceholder}.missionarymemoir.com</div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="control-label">Mission Start Date</label>
            <DatePicker
              className="form-control"
              {...startingDate}
              name="Start Date"
              showYearDropdown
              fixedHeight
              dateFormat="YYYY/M/D"
              minDate={moment(new Date, 'YYYY/M/D')}
              selected={startingDate.value ? moment(startingDate.value, 'YYYY/M/D') : null}
              onChange={(params) => { startingDate.onChange(params); }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="control-label">Mission End Date</label>
            <DatePicker
              className="form-control"
              {...endingDate}
              name="Start Date"
              showYearDropdown
              fixedHeight
              dateFormat="YYYY/M/D"
              minDate={moment(new Date, 'YYYY/M/D')}
              selected={endingDate.value ? moment(endingDate.value, 'YYYY/M/D') : null}
              onChange={(params) => { endingDate.onChange(params); }}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <label className="control-label">Mission Home Address</label>
            <input type="text" className="form-control" {...slug} placeholder={slugPlaceholder} />
            <div className="help-block">Pleople will be able to access your webpage by going to:<br />{slug.value || slugPlaceholder}.missionarymemoir.com</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group text-right">
            {error && <div className="text-danger">{error}</div>}
            <button className="btn btn-success marginless-right" type="submit">Submit</button>
          </div>
        </div>
      </div>
    </form>);
  }
}

WebpageForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

WebpageForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'webpage',
  fields: [
    'slug',
    'webpageTitle',
    'startingDate',
    'endingDate',
  ],
})(WebpageForm);

export default WebpageForm;
