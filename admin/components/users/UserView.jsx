import React, { PropTypes, Component } from 'react';

class UserView extends Component { // eslint-disable-line
  render() {
    return (<div>
      {JSON.stringify(this.props.user)}
    </div>);
  }
}

UserView.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserView;
