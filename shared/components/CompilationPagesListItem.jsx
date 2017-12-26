import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta, isPageEditable } from '../helpers';
import CompilationPageView from './CompilationPageView';
import CompilationPageForm from './CompilationPageForm';
import Loading from './Loading';
import _ from 'lodash';

class CompilationPagesListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
    this.rebuildPdf = this.rebuildPdf.bind(this);
  }
  submitForm() {
    this.refs.form.submitForm();
  }
  rebuildPdf() {
    this.props.rebuildPdf('page', this.props.page._id);
  }
  renderPdfAction() {
    if (_.get(this.props.page, 'pdf.url') && this.props.user.isAdmin) {
      return (<a target="_blank" className="btn btn-primary" href={this.props.page.pdf.url}>
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> PDF
      </a>);
    }
  }
  renderPdfPageCount() {
    if (_.get(this.props.page, 'pdf.pageCount') && this.props.user.isAdmin) {
      return (<div className="label label-default label-sm">
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> {_.get(this.props.page, 'pdf.pageCount')}
      </div>);
    }
  }
  renderRebuildPdfAction() {
    if (this.props.user.isAdmin) {
      let text = <span><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> PDF</span>;
      if (this.props.page.rebuilding) { text = <span>Rebuilding</span>; }
      return (<span className="btn btn-success" onClick={this.rebuildPdf}>
        {text}
      </span>);
    }
  }
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build`}>
      <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
    </Link>);
  }
  renderShowAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`}>
      <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
    </Link>);
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
        text = page.content.message.substring(0, 50).replace(/&n?b?s?p?;?/, ' ');
        if (page.content.messagePreview) text = page.content.messagePreview;
        if (page.content.length > text.length) {
          text = `${text}...`;
        }
      }

      return <span className="page-thumb-helper-text"> - {text}</span>;
    }

    return null;
  }
  renderThumbActions() {
    return (<div className="list-item-actions page-thumb">
      {this.renderPdfPageCount()}
      {this.renderRebuildPdfAction()}
      {this.renderPdfAction()}
      {this.renderShowAction()}
    </div>);
  }
  renderPageThumb() {
    return (<div className="relative">
      {this.renderThumbActions()}
      <div
        className="compilation-pages-list-item list-item"
        onClick={() => {
          this.context.router.push(`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`);
        }}
      >
        <div className="type">
          <span className="glyphicon glyphicon-file" aria-hidden="true"></span> Page
        </div>
        {pageMeta(this.props.page).desc}{this.renderPageHelperText()}
      </div>
    </div>);
  }
  // renderPageThumb() {
  //   return (<Link className="compilation-pages-list-item list-item" to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`}>
  //
  //
  //   </Link>);
  // }
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

CompilationPagesListItem.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPagesListItem.propTypes = {
  page: PropTypes.object.isRequired,
  show: PropTypes.string,
  edit: PropTypes.func,
  user: PropTypes.object.isRequired,
  rebuildPdf: PropTypes.func,
  componentProps: PropTypes.object,
};

export default CompilationPagesListItem;
