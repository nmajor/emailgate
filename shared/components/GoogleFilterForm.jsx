import React, { Component, PropTypes } from 'react';
import * as DateData from '../dateData';
import _ from 'lodash';
import Loading from './Loading';

class GoogleFilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    const subjectRef = this.refs.subject || {};
    const toRef = this.refs.to || {};
    const fromRef = this.refs.from || {};

    const startDateMonth = this.refs.startDateMonth || {};
    const startDateDay = this.refs.startDateDay || {};
    const startDateYear = this.refs.startDateYear || {};

    const endDateMonth = this.refs.endDateMonth || {};
    const endDateDay = this.refs.endDateDay || {};
    const endDateYear = this.refs.endDateYear || {};

    let startDate = new Date(`${startDateMonth.value} ${startDateDay.value}, ${startDateYear.value}`);
    let endDate = new Date(`${endDateMonth.value} ${endDateDay.value}, ${endDateYear.value}`);

    startDate = isNaN(startDate.getTime()) ? null : startDate;
    endDate = isNaN(endDate.getTime()) ? null : endDate;

    this.props.submitForm({
      subject: subjectRef.value,
      to: toRef.value,
      from: fromRef.value,
      startDate,
      endDate,
    });
  }
  renderForm() {
    return (
      <form>
        {this.renderSubjectFormGroup()}

        <div className="row">
          <div className="col-md-6">
            {this.renderToFormGroup()}
          </div>
          <div className="col-md-6">
            {this.renderFromFormGroup()}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {this.renderStartDateFormGroup()}
          </div>
          <div className="col-md-6">
            {this.renderEndDateFormGroup()}
          </div>
        </div>

        {this.renderErrors('base')}
        <button className="btn btn-success" onClick={this.submitForm}>Submit</button>
        {this.renderFetching()}
        {this.renderCount()}
      </form>
    );
  }
  renderCount() {
    console.log(this.props.count);
    if (this.props.count !== undefined) {
      return <span className="left-bumper">{this.props.count} results</span>;
    }
  }
  renderFetching() {
    if (this.props.fetching) {
      return <span className="left-bumper outside-button-loading"><Loading /></span>;
    }
  }
  renderStartDateFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="login-email">Start Date</label>
        {this.renderDatePicker('startDate')}
      </div>
    );
  }
  renderEndDateFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="login-email">End Date</label>
        {this.renderDatePicker('endDate')}
      </div>
    );
  }
  renderDatePicker(ref) {
    const monthOptions = _.map(DateData.months, (val, index) => {
      return <option key={index} value={val}>{val}</option>;
    });

    const dayOptions = _.map(DateData.days, (val, index) => {
      return <option key={index} value={val}>{val}</option>;
    });

    const yearOptions = _.map(DateData.years, (val, index) => {
      return <option key={index} value={val}>{val}</option>;
    });

    return (
      <div className="row">
        <div className="col-md-6">
          <select ref={`${ref}Month`} className="form-control">
            <option value="">- Month</option>
            {monthOptions}
          </select>
        </div>
        <div className="col-md-3">
          <select ref={`${ref}Day`} className="form-control">
            <option value="">- Day</option>
            {dayOptions}
          </select>
        </div>
        <div className="col-md-3">
          <select ref={`${ref}Year`} className="form-control">
            <option value="">- Year</option>
            {yearOptions}
          </select>
        </div>
      </div>
    );
  }
  renderSubjectFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="filter-subject">Subject</label>
        <input
          ref="subject"
          className="form-control"
          type="text"
          id="filter-subject"
          onChange={this.setSaveAbility}
        />
      </div>
    );
  }
  renderToFormGroup() {
    return (<div className="form-group">
      <label htmlFor="filter-to">To Email</label>
      <input
        ref="to"
        type="text"
        className="form-control"
        id="filter-to"
        onChange={this.setSaveAbility}
      />
    </div>);
  }
  renderFromFormGroup() {
    return (<div className="form-group">
      <label htmlFor="filter-from">From Email</label>
      <input
        ref="from"
        type="text"
        className="form-control"
        id="filter-from"
        onChange={this.setSaveAbility}
      />
    </div>);
  }
  renderErrors(type) {
    if (this.props.errors) {
      return this.props.errors[type].map((error, index) => {
        return <p key={index} className="text-danger">{error}</p>;
      });
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

GoogleFilterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
  fetching: PropTypes.bool,
  count: PropTypes.number,
};

export default GoogleFilterForm;
