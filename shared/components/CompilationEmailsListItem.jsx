import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import EmailView from './EmailView';
import CompilationEmailForm from './CompilationEmailForm';
import Loading from './Loading';
import twemoji from 'twemoji';
import _ from 'lodash';

class CompilationEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
    this.rebuildPdf = this.rebuildPdf.bind(this);
    this.reImportEmailBody = this.reImportEmailBody.bind(this);
  }
  reImportEmailBody() {
    this.props.reImportEmailBody(this.props.email._id);
  }
  rebuildPdf() {
    this.props.rebuildPdf('email', this.props.email._id);
  }
  submitForm() {
    this.refs.form.submitForm();
  }
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.email._compilation}/build`}>
      <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
    </Link>);
  }
  renderShowAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`}>
      <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
    </Link>);
  }
  renderPdfPageCount() {
    if (_.get(this.props.email, 'pdf.pageCount') && this.props.user.isAdmin) {
      return (<div className="label label-default label-sm">
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> {_.get(this.props.email, 'pdf.pageCount')}
      </div>);
    }
  }
  renderPdfAction() {
    if (_.get(this.props.email, 'pdf.url') && this.props.user.isAdmin) {
      return (<a target="_blank" className="btn btn-primary" href={this.props.email.pdf.url}>
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> PDF
      </a>);
    }
  }
  renderRebuildPdfAction() {
    if (this.props.user.isAdmin) {
      let text = <span><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> PDF</span>;
      if (this.props.email.rebuilding) { text = <span>Rebuilding</span>; }
      return (<span className="btn btn-success" onClick={this.rebuildPdf}>
        {text}
      </span>);
    }
  }
  renderReImportBodyAction() {
    if (this.props.user.isAdmin && this.props.email.remote_id && this.props.email._account) {
      let text = <span><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> ReImport Body</span>;
      if (this.props.email.reimporting) { text = <span>Rebuilding</span>; }
      return (<span className="btn btn-warning" onClick={this.reImportEmailBody}>
        {text}
      </span>);
    }
  }
  renderRemoveAction() {
    return (<span className="btn btn-danger" onClick={this.props.componentProps.remove}>
      <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
    </span>);
  }
  renderEditAction() {
    return (<Link className="btn btn-warning" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}/edit`}>
      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
    </Link>);
  }
  renderViewAction() {
    return (<Link className="btn btn-primary" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`}>
      <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> View
    </Link>);
  }
  renderSaveAction() {
    const loading = <span><span className="alone-button-loading"><Loading /></span> Saving</span>;
    const icon = <span><span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Save</span>;

    return (<button className="btn btn-success" onClick={this.submitForm}>
      {this.props.email.saving ? loading : icon}
    </button>);
  }
  renderDate() {
    return (<div className="type">
      <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span className="date">{moment(this.props.email.date).format('LL')}</span>
      {this.renderAttachmentIcons()}
    </div>);
  }
  renderSubject() {
    const subject = this.props.email.subject || 'No subject';
    return <div className="subject" dangerouslySetInnerHTML={{ __html: twemoji.parse(subject) }}></div>;
  }
  renderBodyPreview() {
    return <div>{_.isEmpty(this.props.email.bodyPreview) ? 'No email body' : this.props.email.bodyPreview}</div>;
  }
  renderAttachmentIcons() {
    if (this.props.email.attachments.length > 0) {
      // const attachments = this.props.email.attachments.map((attachment, index) => {
      //   return (<span key={index} className="attachment-icon glyphicon glyphicon-picture" aria-hidden="true"></span>);
      // });

      return <span><span className="left-bumper right-bumper">-</span><span className="attachment-icon glyphicon glyphicon-picture" aria-hidden="true"></span> x {this.props.email.attachments.length}</span>;
    }
  }
  renderThumbActions() {
    return (<div className="email-thumb list-item-actions">
      {this.renderPdfPageCount()}
      {this.renderReImportBodyAction()}
      {this.renderRebuildPdfAction()}
      {this.renderPdfAction()}
      {this.renderShowAction()}
    </div>);
  }
  renderEmailThumb() {
    return (<div className="relative">
      {this.renderThumbActions()}
      <div
        className="compilation-emails-list-item list-item"
        onClick={() => {
          this.context.router.push(`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`);
        }}
      >
        {this.renderDate()}
        {this.renderSubject()}
        {this.renderBodyPreview()}
      </div>
    </div>);
  }
  renderEmailListItem() {
    if (this.props.show === 'view') {
      return (<div className="relative">
        <div className="list-item-actions">
          {this.renderEditAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <EmailView email={this.props.email} scroll />
      </div>);
    } else if (this.props.show === 'edit') {
      return (<div className="relative">
        <div className="list-item-actions">
          {this.renderSaveAction()}
          {this.renderViewAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <CompilationEmailForm ref="form" email={this.props.email} submitForm={this.props.edit} rotateAttachment={this.props.rotateAttachment} />
      </div>);
    }

    return this.renderEmailThumb();
  }
  render() {
    return (<div>{this.renderEmailListItem()}</div>);
  }
}

CompilationEmailsListItem.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  view: PropTypes.bool,
  show: PropTypes.string,
  edit: PropTypes.func,
  rotateAttachment: PropTypes.func,
  componentProps: PropTypes.object,
  user: PropTypes.object.isRequired,
  rebuildPdf: PropTypes.func,
  reImportEmailBody: PropTypes.func,
};

export default CompilationEmailsListItem;
