import React, { Component, PropTypes } from 'react';
import Loading from './Loading';
import GoogleAdvancedFilterForm from './GoogleAdvancedFilterForm';

function buildFilterOperators(params) {
  let filterString = '';
  if (params.from) {
    filterString += `from:(${params.from}) `;
  }

  if (params.to) {
    filterString += `to:(${params.to}) `;
  }

  if (params.contains) {
    filterString += `${params.contains} `;
  }

  if (params.doesntContain) {
    filterString += `-{${params.doesntContain}}`;
  }

  return filterString;
  // after:2015/10/19 before:2016/10/20
}

class GoogleFilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showAdvanced: false,
    };

    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitAdvanced = this.submitAdvanced.bind(this);
  }
  toggleAdvanced() {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }
  submitForm(e) {
    e.preventDefault();

    const q = (this.refs.q || {}).value;
    this.props.submitForm({ q });
  }
  submitAdvanced(props) {
    const filterString = buildFilterOperators(props);
    this.refs.q.value = filterString;

    console.log('blah submitAdvanced', props);
  }
  advancedValuesFromQuery() {
    const values = {};
    const q = (this.refs.q || {}).value;

    const to = q.match(/to:\((.*)\)/);
    const from = q.match(/from:\((.*)\)/);
    const contains = q.match(/^.*(?:\)|\s)?(?:)?$/);

    values.to = to ? to[1] : undefined;
    values.from = from ? from[1] : undefined;
    values.contains = contains ? contains[1] : undefined;

    console.log('blah hey', values);
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
        {this.renderErrors('base')}
        {this.renderFetching()}
      </form>
    );
  }
  renderFetching() {
    if (this.props.fetching) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  renderErrors(type) {
    if (this.props.errors && this.props.errors[type]) {
      return this.props.errors[type].map((error, index) => {
        return <p key={index} className="text-danger">{error}</p>;
      });
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
        </div>
      </div>
    );
  }
}

GoogleFilterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
  fetching: PropTypes.bool,
};

export default GoogleFilterForm;
