import React, { PropTypes, Component } from 'react';
import UserView from '../../components/users/UserView';

class UserShowContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>{this.props.user.name}</h1>
      <UserView user={this.props.user} />
    </div>);
  }
}

UserShowContainer.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserShowContainer;
