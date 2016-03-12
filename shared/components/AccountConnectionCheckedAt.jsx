import React, { Component } from 'react';
import moment from 'moment';

class AccountConnectionCheckedAt extends Component {
  constructor(props, context) {
    super(props, context);
    this.refresh = this.refresh.bind(this);
  }
  componentDidMount() {
    this.timer = setInterval(this.refresh, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  refresh() {
    this.forceUpdate();
  }
  render() {
    return (
      <span className="connection-last-checked left-bumper">
        Checked {moment(this.props.connectionCheckedAt).fromNow()}
      </span>
    );
  }
}

AccountConnectionCheckedAt.propTypes = {
  connectionCheckedAt: true,
};

export default AccountConnectionCheckedAt;
