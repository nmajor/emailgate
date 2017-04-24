import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import EmailView from './EmailView';
import CompilationEmailForm from './CompilationEmailForm';
import Loading from './Loading';
import _ from 'lodash';

class CompilationEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
  }
  submitForm() {
    this.refs.form.submitForm();
  }
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.email._compilation}/build`}>
      <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
    </Link>);
  }
  renderRemoveAction() {
    return (<span className="btn btn-danger" onClick={this.props.componentProps.remove}>
      <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
    </span>);
  }
  renderEditAction() {
    return (<Link className="btn btn-warning" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}/edit`}>
      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
    </Link>);
  }
  renderViewAction() {
    return (<Link className="btn btn-primary" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`}>
      <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
    </Link>);
  }
  renderSaveAction() {
    const loading = <span className="alone-button-loading"><Loading /></span>;
    const icon = <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>;

    return (<button className="btn btn-success" onClick={this.submitForm}>
      {this.props.email.saving ? loading : icon}
    </button>);
  }
  renderDate() {
    return (<div className="type">
      <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span className="date">{moment(this.props.email.date).format('LL')}</span>
    </div>);
  }
  renderSubject() {
    return <div className="subject">{this.props.email.subject || 'No subject'}</div>;
  }
  renderBodyPreview() {
    return <div>{_.isEmpty(this.props.email.bodyPreview) ? 'No email body' : this.props.email.bodyPreview}</div>;
  }
  renderEmailThumb() {
    return (<Link
      className="compilation-emails-list-item list-item" to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`}
    >
      {this.renderDate()}
      {this.renderSubject()}
      {this.renderBodyPreview()}
    </Link>);
  }
  renderEmailListItem() {
    if (this.props.show === 'view') {
      return (<div>
        <div className="list-item-actions">
          {this.renderEditAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <EmailView email={this.props.email} scroll />
      </div>);
    } else if (this.props.show === 'edit') {
      return (<div>
        <div className="list-item-actions">
          {this.renderSaveAction()}
          {this.renderViewAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <CompilationEmailForm ref="form" email={this.props.email} submitForm={this.props.edit} />
      </div>);
    }

    return this.renderEmailThumb();
  }
  render() {
    return (<div>{this.renderEmailListItem()}</div>);
  }
}

CompilationEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  view: PropTypes.bool,
  show: PropTypes.string,
  edit: PropTypes.func,
  componentProps: PropTypes.object,
};

export default CompilationEmailsListItem;
