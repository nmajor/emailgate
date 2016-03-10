import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class AccountListItem extends Component {
  render() {
    return (
      <div className="accounts-list-item">
        {this.props.account.email} <Link to={`/accounts/${this.props.account._id}/edit`}>edit</Link>
      </div>
    );
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
};

export default AccountListItem;
