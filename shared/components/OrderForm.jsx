import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class OrderForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      terms: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormStateForCheckbox = this.setFormStateForCheckbox.bind(this);
  }
  setFormStateForCheckbox(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.checked;

    this.setState(newState);
  }
  handleSubmit(e) {
    e.preventDefault();

    this.props.submit(this.state);
  }
  renderSubmitting() {
    if (this.props.submitting) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  renderBackAction() {
    if (this.props.error) {
      return <div className="btn btn-danger left-bumper" disabled={this.props.submitting} onClick={this.props.back}>Back</div>;
    }
  }
  renderError() {
    if (this.props.error) {
      return <div className="text-danger bottom-bumper">{this.props.error.message}</div>;
    }
  }
  renderTerms() {
    return (<div className="checkbox">
      <label>
        <input type="checkbox" name="terms" checked={this.state.terms} onClick={this.setFormStateForCheckbox} /> I agree to the site <a href="/terms" target="_blank">terms.</a>
      </label>
    </div>);
  }
  renderSubmitAction() {
    return <div className="btn btn-success" disabled={!this.state.terms || this.props.submitting} onClick={this.handleSubmit}>Submit</div>;
  }
  render() {
    return (<div>
      <form>
        {this.renderTerms()}
        <div>
          {this.renderError()}
          {this.renderSubmitAction()}
          {this.renderBackAction()}
          {this.renderSubmitting()}
        </div>
      </form>
    </div>);
  }
}

OrderForm.propTypes = {
  submit: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default OrderForm;
