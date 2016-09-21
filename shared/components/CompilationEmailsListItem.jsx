import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import EmailView from './EmailView';
import CompilationEmailForm from './CompilationEmailForm';
import Loading from './Loading';

class CompilationEmailsListItem extends Component {
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.email._compilation}/build`}>
      <span className="glyphicon glyphicon-collapse-up" aria-hidden="true"></span>
    </Link>);
  }
  renderRemoveAction() {
    const icon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;
    const loading = <span className="alone-button-loading"><Loading /></span>;
    return (<span className="btn btn-danger" onClick={this.props.componentProps.remove}>
      {this.props.email.saving ? loading : icon}
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
  renderDate() {
    return (<div className="type">
      <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span className="date">{moment(this.props.email.date).format('LL')}</span>
    </div>);
  }
  renderSubject() {
    return <div className="subject">{this.props.email.subject}</div>;
  }
  renderBodyPreview() {
    return <div>{this.props.email.bodyPreview}</div>;
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
        <EmailView email={this.props.email} />
      </div>);
    } else if (this.props.show === 'edit') {
      return (<div>
        <div className="list-item-actions">
          {this.renderViewAction()}
          {this.renderRemoveAction()}
          {this.renderHideAction()}
        </div>
        <CompilationEmailForm email={this.props.email} submitForm={this.props.edit} />
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
