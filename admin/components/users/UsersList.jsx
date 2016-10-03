import React, { PropTypes, Component } from 'react';
import UsersListItem from './UsersListItem';

class UsersList extends Component {
  renderUsersList() {
    return this.props.users.map((user) => {
      return <UsersListItem key={user._id} user={user} />;
    });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          {this.renderUsersList()}
        </div>
      </div>
    );
  }
}

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UsersList;
