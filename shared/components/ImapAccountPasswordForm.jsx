import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class ImapAccountPasswordForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { password: this.props.password };
    this.submitForm = this.submitForm.bind(this);
    this.setFormState = this.setFormState.bind(this);
  }

  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;
    this.setState(newState);
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm(this.state);
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  renderPasswordFormGroup() {
    return (
      <div className="form-group">
        <input
          name="password"
          className="form-control"
          type="password"
          id="login-password"
          onChange={this.setFormState}
        />
      </div>
    );
  }
  renderLoading() {
    return <span className="outside-button-loading"><Loading /></span>;
  }
  renderConnectionStatus() {
    if (this.props.currentAccount.checkingConnection) {
      return this.renderLoading();
    } else if (this.props.currentAccount.connectionValid === false) {
      return <span className="text-danger">Could Not Connect.</span>;
    }
  }
  render() {
    return (<div className="top-bumper padded-box">
      <div className="bottom-bumper">Please re-enter your password for {this.props.currentAccount.email} so we can connect.</div>
      <form className="form-inline" onSubmit={this.handleSubmit}>
        {this.renderPasswordFormGroup()}
        <button className="btn btn-success left-bumper" onClick={this.submitForm}>Submit</button>
        {this.renderConnectionStatus()}
      </form>
    </div>);
  }
}

ImapAccountPasswordForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  currentAccount: PropTypes.object.isRequired,
  password: PropTypes.string,
};

export default ImapAccountPasswordForm;
