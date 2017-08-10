import React, { PropTypes, Component } from 'react';
import moment from 'moment';

class UserView extends Component { // eslint-disable-line
  render() {
    return (<div className="padded-box bottom-bumper">
      <div>Name: {this.props.user.name}</div>
      <div>Email: {this.props.user.email}</div>
      <div>Registered on: {moment(this.props.user.createdAt).format('LLL')} - {moment(this.props.user.createdAt).fromNow()}</div>
      <a href="https://missionarymemoir.freshdesk.com/helpdesk/tickets/compose_email">Send this user an email</a>
    </div>);
  }
}

UserView.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserView;
