import React, { Component, PropTypes } from 'react';
// import Loading from './Loading';
import _ from 'lodash';
import GoogleAdvancedFilterForm from './GoogleAdvancedFilterForm';

function buildFilterOperators(params) {
  let filterString = '';
  if (params.from) {
    filterString += `from:(${params.from}) `;
  }

  if (params.to) {
    filterString += `to:(${params.to}) `;
  }

  if (params.subject) {
    filterString += `subject:(${params.subject}) `;
  }

  if (params.contains) {
    filterString += `${params.contains} `;
  }

  if (params.doesntContain) {
    filterString += `-{${params.doesntContain}}`;
  }

  if (params.start) {
    filterString += `start:${params.start}`;
  }

  if (params.end) {
    filterString += `end:${params.end}`;
  }

  return filterString;
}

class GoogleFilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showAdvanced: true,
    };

    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitAdvanced = this.submitAdvanced.bind(this);
  }
  toggleAdvanced() {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }
  submitForm(e) {
    if (e) { e.preventDefault(); }

    let q = (this.refs.q || {}).value || '';
    q = q.replace('end:', 'before:').replace('start:', 'after:');
    this.props.submitForm({ q });
  }
  submitAdvanced(props) {
    const filterString = buildFilterOperators(props);
    this.refs.q.value = filterString;
    this.setState({ showAdvanced: false });
    this.submitForm();
  }
  advancedValuesFromQuery() {
    const q = (this.refs.q || {}).value || '';

    const toReg = /to:\((.*?)\)/;
    const fromReg = /from:\((.*?)\)/;
    const subjectReg = /subject:\((.*?)\)/;
    const doesntContainResp = /-{(.*?)}/;
    const startReg = /start:(.*?) /;
    const endReg = /end:(.*?) /;

    const to = (q.match(toReg) || [])[1];
    const from = (q.match(fromReg) || [])[1];
    const subject = (q.match(subjectReg) || [])[1];
    const doesntContain = (q.match(doesntContainResp) || [])[1];
    const start = (q.match(startReg) || [])[1];
    const end = (q.match(endReg) || [])[1];

    const contains = q.replace(toReg, '')
    .replace(fromReg, '')
    .replace(subjectReg, '')
    .replace(doesntContainResp, '')
    .replace(startReg, '')
    .replace(endReg, '')
    .trim();

    const values = {
      to,
      from,
      subject,
      contains,
      doesntContain,
      start,
      end,
    };

    return values;
  }
  renderForm() {
    return (
      <form>
        <div className="row">
          <div className="col-xs-12">
            <div className="input-group input-group-lg">
              <input
                ref="q"
                className="form-control"
                type="text"
                id="filter-q"
                placeholder="Search Gmail..."
                autoComplete="off"
                onChange={this.setSaveAbility}
              />
              <div className="input-group-btn">
                <button className="btn btn-block btn-success" onClick={this.submitForm}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
  renderErrors(type) {
    if (this.props.errors && this.props.errors[type]) {
      return this.props.errors[type].map((error, index) => {
        return <p key={index} className="text-danger">{error}</p>;
      });
    }
  }
  renderReconnect() {
    if (_.get(this.props, 'errors.reauth')) {
      return this.props.renderReconnect();
    }
  }
  renderAdvancedForm() {
    if (this.state.showAdvanced) {
      return <GoogleAdvancedFilterForm initialValues={this.advancedValuesFromQuery()} onSubmit={this.submitAdvanced} toggleAdvanced={this.toggleAdvanced} />;
    }

    return (<div className="toggle-search-help">
      <span onClick={this.toggleAdvanced}>show advanced search</span>
    </div>);
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          {this.renderForm()}
          {this.renderAdvancedForm()}
          {this.renderErrors('base')}
          {this.renderReconnect()}
        </div>
      </div>
    );
  }
}

GoogleFilterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
  fetching: PropTypes.bool,
  renderReconnect: PropTypes.func,
};

export default GoogleFilterForm;
