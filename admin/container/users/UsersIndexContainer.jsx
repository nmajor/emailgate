import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import UsersList from '../../components/users/UsersList';

class UsersIndex extends Component { // eslint-disable-line
  componentDidMount() {
    if (this.props.users.length < 1) {
      this.props.dispatch(Actions.getUsers());
    }
  }
  render() {
    return (<div>
      <h1>Users</h1>
      <UsersList users={this.props.users} />
    </div>);
  }
}

UsersIndex.need = [
  (params, cookie) => {
    return Actions.getUsers.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    users: store.users,
  };
}

UsersIndex.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(UsersIndex);
