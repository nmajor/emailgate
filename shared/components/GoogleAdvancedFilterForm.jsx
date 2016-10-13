import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class GoogleAdvancedFilterForm extends Component { // eslint-disable-line
  render() {
    const {
      fields: {
        from,
        to,
        subject,
        contains,
        doesntContain,
        start,
        end,
      },
      handleSubmit,
    } = this.props;

    return (<div>
      <div className="toggle-search-help hide-advanced"><span onClick={this.props.toggleAdvanced}>hide advanced search</span></div>
      <div className="padded-box top-bumper">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label className="control-label">From</label>
                <input type="text" className="form-control" {...from} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label className="control-label">To</label>
                <input type="text" className="form-control" {...to} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Subject contains</label>
            <input type="text" className="form-control" {...subject} />
          </div>
          <div className="form-group">
            <label className="control-label">Has the words</label>
            <input type="text" className="form-control" {...contains} />
          </div>
          <div className="form-group">
            <label className="control-label">Doesnt have</label>
            <input type="text" className="form-control" {...doesntContain} />
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label className="control-label">Start date</label>
                <DatePicker
                  className="form-control"
                  {...start}
                  name="Start Date"
                  showYearDropdown
                  fixedHeight
                  dateFormat="YYYY/M/D"
                  maxDate={moment(new Date, 'YYYY/M/D')}
                  selected={start.value ? moment(start.value, 'YYYY/M/D') : null}
                  onChange={(params) => { start.onChange(params); }}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label className="control-label">End date</label>
                <DatePicker
                  className="form-control"
                  {...end}
                  name="End Date"
                  showYearDropdown
                  fixedHeight
                  dateFormat="YYYY/M/D"
                  maxDate={moment(new Date, 'YYYY/M/D')}
                  selected={end.value ? moment(end.value, 'YYYY/M/D') : null}
                  onChange={(params) => { end.onChange(params); }}
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <button className="btn btn-success marginless-right" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>);
  }
}

GoogleAdvancedFilterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  toggleAdvanced: PropTypes.func.isRequired,
};

GoogleAdvancedFilterForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'googleAdvanced',
  fields: [
    'from',
    'to',
    'subject',
    'contains',
    'doesntContain',
    'city',
    'start',
    'end',
  ],
})(GoogleAdvancedFilterForm);

export default GoogleAdvancedFilterForm;
