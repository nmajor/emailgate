import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class SelectAccountListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCheckboxClick = this.handleClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleClick() {
    if (!this.props.selected) {
      this.props.selectAccount(this.props.account);
    } else {
      this.props.deselectAccount();
    }
  }
  handleDeleteClick() {
    if (this.props.handleDeleteClick && window.confirm('Are you sure you want to delete this account?')) { // eslint-disable-line no-alert
      this.props.handleDeleteClick(this.props.account);
    }
  }
  renderChangeLink() {
    if (this.props.selected) {
      return <span className="btn-link text-danger pointer" onClick={this.props.deselectAccount}>Use a different account</span>;
    }
  }
  renderRemoveLink() { // eslint-disable-line consistent-return
    if (this.props.handleDeleteClick) {
      return (<span className="btn btn-xs-true btn-danger left-bumper" onClick={this.handleDeleteClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </span>);
    }
  }
  renderEditLink() { // eslint-disable-line consistent-return
    if (this.props.account.kind === 'imap') {
      return (<Link className="left-bumper btn btn-xs-true btn-warning" to={`/accounts/${this.props.account._id}/edit`}>
        <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
      </Link>);
    }
  }
  renderEmail() { // eslint-disable-line consistent-return
    return <span>{this.props.account.email}</span>;
  }
  // renderConnectionStatus() {
  //   if (this.props.account.connectionValid === true
  //   && (
  //     (new Date).getTime() < _.get(this.props.account, 'authProps.token.expiry_date'))
  //     || this.props.account.kind === 'imap'
  //   ) {
  //     return (<span className="label label-success right-bumper">
  //       <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
  //     </span>);
  //   }
  // }
  renderCheckbox() {
    return (<span className={`my-checkbox ${this.props.selected ? 'checked' : ''}`} onClick={this.handleCheckboxClick}>
      {this.props.selected ? <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> : null}
    </span>);
  }
  render() {
    return (
      <div className="selected-account-list-item">
        {this.renderCheckbox()}
        <span className="email left-bumper">
          {this.renderEmail()}
        </span>
        <span className="actions">
          {this.renderChangeLink()}
          {this.renderEditLink()}
          {this.renderRemoveLink()}
        </span>
      </div>
    );
  }
}

SelectAccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  selectAccount: PropTypes.func,
  deselectAccount: PropTypes.func,
  handleDeleteClick: PropTypes.func,
};

export default SelectAccountListItem;
