import React, { PropTypes, Component } from 'react';
// import AccountExpiryLabel from './AccountExpiryLabel';
import { Link } from 'react-router';
import _ from 'lodash';

class AccountListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.account);
    }
  }
  handleDeleteClick() {
    if (this.props.handleDeleteClick && window.confirm('Are you sure you want to delete this account?')) { // eslint-disable-line no-alert
      this.props.handleDeleteClick(this.props.account);
    }
  }
  renderRemoveLink() { // eslint-disable-line consistent-return
    if (this.props.handleDeleteClick) {
      return (<span className="btn btn-default btn-xs" onClick={this.handleDeleteClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
      </span>);
    }
  }
  renderEditLink() { // eslint-disable-line consistent-return
    if (this.props.account.kind === 'imap') {
      return (<Link className="btn btn-default btn-xs" to={`/accounts/${this.props.account._id}/edit`}>
        <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
      </Link>);
    }
  }
  renderEmail() { // eslint-disable-line consistent-return
    return <span>{this.props.account.email}</span>;
  }
  renderConnectionStatus() {
    if (this.props.account.connectionValid === true
    && (
      (new Date).getTime() < _.get(this.props.account, 'props.token.expiry_date'))
      || this.props.account.kind === 'imap'
    ) {
      return (<span className="label label-success right-bumper">
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </span>);
    }

    // if (this.props.account.connectionValid === false
    // || (new Date).getTime() > _.get(this.props.account, 'props.token.expiry_date')) {
    //   return (<span className="label label-warning">
    //     <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
    //   </span>);
    // } else if (this.props.account.connectionValid === true
    // && (new Date).getTime() < _.get(this.props.account, 'props.token.expiry_date')) {
    //   return (<span className="label label-success">
    //     <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
    //   </span>);
    // }
    //
    // return (<span className="label label-default">
    //   <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
    // </span>);
  }
  renderSelected() { // eslint-disable-line consistent-return
    if (this.props.selected) {
      return 'selected';
    }
  }
  renderClassName() {
    let className = 'accounts-list-item ';
    // className += this.props.selectable ? 'selectable ' : '';
    className += this.props.selected ? 'selected ' : '';
    return className;
  }
  renderKind() {
    const kindMap = {
      google: 'Gmail',
      imap: 'IMAP',
    };

    return <span className="label label-default right-bumper">{kindMap[this.props.account.kind]}</span>;
  }
  renderExpiryLabel() {
    // return <AccountExpiryLabel account={this.props.account} googleAuthUrl={this.props.googleAuthUrl} />;
  }
  // renderSelectLink() {
  //   if (this.props.selectable) {
  //     return <span className="btn btn-success">Select</span>;
  //   }
  // }
  renderSelectAction() {
    if (this.props.selectable) {
      return <span className={`btn btn-success btn-xs ${this.props.selected ? 'disabled' : ''}`} onClick={this.handleClick}>Select</span>;
    }
  }
  render() {
    return (
      <div className={this.renderClassName()} onClick={this.handleClick}>
        <h4>
          {this.renderConnectionStatus()}
          {this.renderEmail()}
        </h4>
        <div className="actions">
          {this.renderExpiryLabel()}
          {this.renderKind()}
          {this.renderSelectAction()}
          {this.renderEditLink()}
          {this.renderRemoveLink()}
        </div>
      </div>
    );
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
};

export default AccountListItem;
