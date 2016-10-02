import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class CompilationMessageForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { savable: false };

    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
    this.setSaveAbility = this.setSaveAbility.bind(this);
  }
  setSaveAbility() {
    if (this.formChanged()) {
      this.setState({ savable: true });
    } else {
      this.setState({ savable: false });
    }
  }
  formChanged() {
    const messageRef = this.refs.message || {};
    const fromRef = this.refs.from || {};

    if (messageRef.value !== this.props.page.content.message) {
      return true;
    } else if (fromRef.value !== this.props.page.content.signature) {
      return true;
    }
    return false;
  }
  submitForm(e) {
    e.preventDefault();
    if (!this.state.savable) { return; }

    const messageRef = this.refs.message || {};
    const fromRef = this.refs.from || {};

    this.props.submitForm({
      message: messageRef.value,
      from: fromRef.value,
    });
  }
  back(e) {
    e.preventDefault();
    this.props.back();
  }
  renderLoading() {
    if (this.props.fetching) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderMessageFormGroup() {
    return (<div className="form-group">
      <label htmlFor="compilation-message">Message</label>
      <textarea
        ref="message"
        className="form-control"
        type="text"
        id="compilation-message"
        defaultValue={this.props.page.content.message}
        onChange={this.setSaveAbility}
      ></textarea>
    </div>);
  }
  renderFromFormGroup() {
    return (<div className="form-group">
      <label htmlFor="compilation-from">From</label>
      <input
        ref="from"
        className="form-control"
        type="text"
        id="compilation-from"
        defaultValue={this.props.page.content.signature}
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
  renderBackAction() {
    if (this.props.back) {
      return <button className="btn btn-danger" onClick={this.back}>Back</button>;
    }
  }
  render() {
    return (<form onSubmit={this.handleSubmit}>
      {this.renderMessageFormGroup()}
      {this.renderFromFormGroup()}
      {this.renderErrors('base')}
      <button className={`btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>
        Save
        {this.renderLoading()}
      </button>
      {this.renderBackAction()}
    </form>);
  }
}

CompilationMessageForm.propTypes = {
  page: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  errors: PropTypes.object,
  fetching: PropTypes.bool,
};

export default CompilationMessageForm;
