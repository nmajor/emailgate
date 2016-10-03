import React, { PropTypes, Component } from 'react';

class UsersListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      {this.props.user.name} - {this.props.user.email}
    </div>);
  }
}

UsersListItem.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UsersListItem;
