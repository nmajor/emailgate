import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class GoogleFilterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();

    const q = (this.refs.q || {}).value;
    this.props.submitForm({ q });
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
};

export default GoogleFilterForm;
