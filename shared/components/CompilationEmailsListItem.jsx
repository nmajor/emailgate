import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Loading from './Loading';

class CompilationEmailsListItem extends Component {
  className() {
    let className = 'compilation-emails-list-item list-item';
    className += this.props.current ? ' current' : '';

    return className;
  }
  renderSaving() {
    return <span className="icon-loading"><Loading /></span>;
  }
  renderIcon() {
    if (this.props.email.saving) {
      return this.renderSaving();
    }

    return null;
  }
  render() {
    return (<Link className={this.className()} to={`/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`}>
      <div className="type">
        <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> Email
      </div>
      {this.renderIcon()}
      {this.props.email.subject}
      <div className="date">{moment(this.props.email.date).format('LL')}</div>
    </Link>);
  }
}

CompilationEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  current: PropTypes.bool,
};

export default CompilationEmailsListItem;
