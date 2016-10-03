import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class UsersListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/users/${this.props.user._id}`}>
        {this.props.user.name} - {this.props.user.email}
      </Link>
    </div>);
  }
}

UsersListItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UsersListItem;
