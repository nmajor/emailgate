import React, { Component, PropTypes } from 'react';
import ImageSelector from './ImageSelector';
import Loading from './Loading';
import covers from '../templates/covers';

class CompilationTitleForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      savable: false,
      coverTemplate: props.compilation.coverTemplate || covers.options[0],
      showImageSelector: false,
      image: undefined,
    };

    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
    this.setSaveAbility = this.setSaveAbility.bind(this);
    this.openImageSelector = this.openImageSelector.bind(this);
    this.closeImageSelector = this.closeImageSelector.bind(this);
    this.updateCompilationImage = this.updateCompilationImage.bind(this);
  }
  setSaveAbility() {
    if (this.formChanged()) {
      this.setState({ savable: true });
    } else {
      this.setState({ savable: false });
    }
  }
  openImageSelector() {
    this.setState({ showImageSelector: true });
  }
  closeImageSelector() {
    this.setState({ showImageSelector: false });
  }
  updateCompilationImage(data) {
    this.setState({ image: data, savable: true });
    this.closeImageSelector();
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
      image: this.state.image,
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
  renderTemplateOption(option) {
    return (<div className="col-md-2 col-sm-3 col-xs-4">
      <span
        className={`template-thumb ${this.state.coverTemplate === option ? 'active' : ''}`}
        onClick={() => { this.setState({ coverTemplate: option }); this.setState({ savable: true }); }}
      >
        <img role="presentation" className="img-responsive" src={`/img/cover-thumbs/${option}.png`} />
      </span>
    </div>);
  }
  renderTemplateOptions() {
    return covers.options.map((option, index) => {
      return <div key={index}>{this.renderTemplateOption(option)}</div>;
    });
  }
  renderTemplateFormGroup() {
    return (<div className="row cover-templates">
      <div className="col-md-12">
        <div className="form-group">
          <div className="text-center">
            <label htmlFor="compilation-title">Cover Template</label>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-1 col-xs-0"></div>
            {this.renderTemplateOptions()}
          </div>
        </div>
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

    if (titleRef.value || this.props.compilation.title) {
      const compilation = {
        title: titleRef.value || this.props.compilation.title,
        subtitle: subtitleRef.value || this.props.compilation.subtitle,
        cover: {
          spineWidth: '',
        },
        image: this.props.compilation.image,
      };

      // <div dangerouslySetInnerHTML={{ __html: coverTemplate.frontCoverToString() }}></div>;
      // {coverTemplate.renderFrontCover()}

      const coverTemplate = new covers[this.state.coverTemplate]({ compilation, bleedType: 'bleedless', image: this.state.image, selectImage: this.openImageSelector });
      return (<div style={{ zoom: '100%' }}>
        {coverTemplate.renderWrappedFrontCover()}
      </div>);
    }
  }
  render() {
    return (<form onSubmit={this.handleSubmit}>
      <ImageSelector isVisible={this.state.showImageSelector} close={this.closeImageSelector} submit={this.updateCompilationImage} />
      <div className="row">
        <div className="col-md-6">
          {this.renderTitleFormGroup()}
          {this.renderSubtitleFormGroup()}
          <hr />
          {this.renderTemplateFormGroup()}
          <hr />
          {this.renderErrors('base')}
          <div className="text-right hidden-sm hidden-xs">
            {this.renderBackAction()}
            <button className={`marginless-right btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>
              Submit
              {this.renderLoading()}
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="cover-preview">
            <div className="template">
              {this.renderCoverPreview()}
            </div>
          </div>
          <div className="text-right hidden-md hidden-lg">
            {this.renderBackAction()}
            <button className={`marginless-right btn btn-success ${this.state.savable ? '' : 'disabled'}`} onClick={this.submitForm}>
              Submit
              {this.renderLoading()}
            </button>
          </div>
        </div>
      </div>
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
