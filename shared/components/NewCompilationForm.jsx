import React, { Component, PropTypes } from 'react';

class NewCompilationForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { savable: false };

    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
    this.setSaveAbility = this.setSaveAbility.bind(this);
  }
  componentDidMount() {
    this.setSaveAbility();
  }
  setSaveAbility() {
    if (this.formChanged()) {
      this.setState({ savable: true });
    } else {
      this.setState({ savable: false });
    }
  }
  formChanged() {
    const nameRef = this.refs.name || {};

    if (nameRef.value !== this.props.compilation.name) {
      return true;
    }
    return false;
  }
  submitForm(e) {
    e.preventDefault();
    if (!this.state.savable) { return; }

    const emailRef = this.refs.email || {};
    const passwordRef = this.refs.password || {};
    const hostRef = this.refs.host || {};
    const portRef = this.refs.port || {};

    this.props.submitForm({
      email: emailRef.value,
      password: passwordRef.value,
      host: hostRef.value,
      port: portRef.value,
    });
  }
  back(e) {
    e.preventDefault();
    this.props.back();
  }
  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderNameFormGroup()}

        {this.renderErrors('base')}
        <button className={`btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>Save</button>
        <button className="btn btn-danger left-bumper" onClick={this.back}>Back</button>
      </form>
    );
  }
  renderNameFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="compilation-name">Name</label>
        <input
          ref="name"
          className="form-control"
          type="text"
          id="compilation-name"
          defaultValue={this.props.compilation.name}
          placeholder="Jon Doe's Emails"
          onChange={this.setSaveAbility}
        />
      </div>
    );
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
        <div className="col-md-6 col-sm-8">
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

NewCompilationForm.propTypes = {
  compilation: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default NewCompilationForm;
