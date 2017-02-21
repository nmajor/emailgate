import React, { Component, PropTypes } from 'react';
import Loading from './Loading';
import covers from '../templates/covers';

class CompilationTitleForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      savable: false,
      coverTemplate: props.compilation.coverTemplate || covers.options[0],
    };

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
    } else if (this.state.coverTemplate !== this.props.compilation.coverTemplate) {
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
      coverTemplate: this.state.coverTemplate,
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
  renderTemplateFormGroup() {
    return (<div className="form-group">
      <label htmlFor="compilation-title">Cover Template</label>
      <div>
        <span
          className={`btn btn-default ${this.state.coverTemplate === 'BoxTitle' ? 'active' : ''}`}
          onClick={() => { this.setState({ coverTemplate: 'BoxTitle' }); this.setSaveAbility(); }}
        >Template 1</span>
        <span
          className={`btn btn-default ${this.state.coverTemplate === 'BlackSpine' ? 'active' : ''}`}
          onClick={() => { this.setState({ coverTemplate: 'BlackSpine' }); this.setSaveAbility(); }}
        >Template 2</span>
      </div>
    </div>);
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
  renderCoverPreview() {
    const titleRef = this.refs.title || {};
    const subtitleRef = this.refs.subtitle || {};

    const compilation = {
      title: titleRef.value || this.props.compilation.title,
      subtitle: subtitleRef.value || this.props.compilation.subtitle,
      cover: {
        spineWidth: '',
      },
    };

    const coverTemplate = new covers[this.state.coverTemplate]({ compilation, bleedType: 'bleedless' });
    return (<div>
      {coverTemplate.renderFrontCover()}
    </div>);
  }
  render() {
    return (<form onSubmit={this.handleSubmit}>
      {this.renderTitleFormGroup()}
      {this.renderSubtitleFormGroup()}
      {this.renderTemplateFormGroup()}
      {this.renderErrors('base')}
      <div className="text-right">
        {this.renderBackAction()}
        <button className={`marginless-right btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>
          Submit
          {this.renderLoading()}
        </button>
      </div>
      {this.renderCoverPreview()}
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
