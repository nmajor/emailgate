import React, { Component, PropTypes } from 'react';
import Loading from './Loading';

class CompilationTitleForm extends Component {
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
    const titleRef = this.refs.title || {};
    const subtitleRef = this.refs.subtitle || {};

    if (titleRef.value !== this.props.compilation.title) {
      return true;
    } else if (subtitleRef.value !== this.props.compilation.subtitle) {
      return true;
    }
    return false;
  }
  submitForm(e) {
    e.preventDefault();
    if (!this.state.savable) { return; }

    const titleRef = this.refs.title || {};
    const subtitleRef = this.refs.subtitle || {};

    this.props.submitForm({
      title: titleRef.value,
      subtitle: subtitleRef.value,
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
  renderTitleFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="compilation-title">Title</label>
        <input
          ref="title"
          className="form-control"
          type="text"
          id="compilation-title"
          defaultValue={this.props.compilation.title}
          placeholder="My Email Book"
          onChange={this.setSaveAbility}
        />
      </div>
    );
  }
  renderSubtitleFormGroup() {
    return (
      <div className="form-group">
        <label htmlFor="compilation-subtitle">Subtitle</label>
        <input
          ref="subtitle"
          className="form-control"
          type="text"
          id="compilation-subtitle"
          defaultValue={this.props.compilation.subtitle}
          placeholder="Optional"
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
  renderBackAction() {
    if (this.props.back) {
      return <button className="btn btn-danger" onClick={this.back}>Back</button>;
    }
  }
  render() {
    return (<form onSubmit={this.handleSubmit}>
      {this.renderTitleFormGroup()}
      {this.renderSubtitleFormGroup()}
      {this.renderErrors('base')}
      <button className={`btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>
        Submit
        {this.renderLoading()}
      </button>
      {this.renderBackAction()}
    </form>);
  }
}

CompilationTitleForm.propTypes = {
  compilation: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func,
  errors: PropTypes.object,
  fetching: PropTypes.bool,
};

export default CompilationTitleForm;
