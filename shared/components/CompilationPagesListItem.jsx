import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta, isPageEditable } from '../helpers';
import CompilationPageView from './CompilationPageView';
import CompilationPageForm from './CompilationPageForm';
import Loading from './Loading';

class CompilationPagesListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm() {
    this.refs.form.submitForm();
  }
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build`}>
      <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
    </Link>);
  }
  renderShowAction() {
    return (<div className="btn btn-default">
      <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
    </div>);
  }
  renderEditAction() {
    if (!isPageEditable(this.props.page)) { return null; }

    let linkTo = `/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}/edit`;

    if (this.props.page.type === 'title-page'
    || this.props.page.type === 'cover') {
      linkTo = `/compilations/${this.props.page._compilation}/build/title`;
    }

    return (<Link className="btn btn-warning" to={linkTo}>
      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
    </Link>);
  }
  renderViewAction() {
    return (<Link className="btn btn-primary" to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`}>
      <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> View
    </Link>);
  }
  renderSaveAction() {
    if (!isPageEditable(this.props.page)) { return null; }

    const loading = <span><span className="alone-button-loading"><Loading /></span> Saving</span>;
    const icon = <span><span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Save</span>;

    return (<button className="btn btn-success" onClick={this.submitForm}>
      {this.props.page.saving ? loading : icon}
    </button>);
  }
  renderRemoveAction() {
    if (!isPageEditable(this.props.page)) { return null; }

    return (<span className="btn btn-danger" onClick={this.props.componentProps.remove}>
      <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
    </span>);
  }
  renderPageHelperText() {
    const { page } = this.props;
    if (page.type === 'message-page') {
      let text = 'Edit this page to change its content.';

      if (page.content) {
        text = page.content.message.substring(0, 50);
        if (page.content.message.length > text.length) {
          text = `${text}...`;
        }
      }

      return <span className="page-thumb-helper-text"> - {text}</span>;
    }

    return null;
  }
  renderPageThumb() {
    return (<Link className="compilation-pages-list-item list-item" to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`}>
      <div className="list-item-actions page-thumb">
        {this.renderShowAction()}
      </div>
      <div className="type">
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> Page
      </div>
      {pageMeta(this.props.page).desc}{this.renderPageHelperText()}
    </Link>);
  }
  renderPageListItem() {
    if (this.props.show === 'view') {
      return (<div className="relative">
        <div className="list-item-actions">
          {this.renderEditAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <CompilationPageView componentProps={this.props.componentProps} page={this.props.page} />
      </div>);
    } else if (this.props.show === 'edit') {
      return (<div className="relative">
        <div className="list-item-actions">
          {this.renderSaveAction()}
          {this.renderViewAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <CompilationPageForm
          ref="form"
          page={this.props.page}
          templateFactory={this.props.componentProps.templateFactory}
          rotateImage={this.props.componentProps.rotateImage}
          submitForm={this.props.edit}
        />
      </div>);
    }

    return this.renderPageThumb();
  }
  render() {
    return this.renderPageListItem();
  }
}

CompilationPagesListItem.propTypes = {
  page: PropTypes.object.isRequired,
  show: PropTypes.string,
  edit: PropTypes.func,
  componentProps: PropTypes.object,
};

export default CompilationPagesListItem;
