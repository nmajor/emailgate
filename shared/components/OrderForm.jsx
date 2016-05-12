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
  renderTerms() {
    return (<div className="checkbox">
      <label>
        <input type="checkbox" name="terms" checked={this.state.terms} onClick={this.setFormStateForCheckbox} /> I agree to the site <a href="/terms" target="_blank">terms.</a>
      </label>
    </div>);
  }
  renderSubmitAction() {
    return <div className="btn btn-success" disabled={!this.state.terms} onClick={this.handleSubmit}>Submit</div>;
  }
  render() {
    return (<div>
      <form>
        {this.renderTerms()}
        <div>
          {this.renderSubmitAction()}
          {this.renderSubmitting()}
        </div>
      </form>
    </div>);
  }
}

OrderForm.propTypes = {
  submit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default OrderForm;
