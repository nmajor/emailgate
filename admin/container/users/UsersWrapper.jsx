import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';

class UsersWrapper extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.user = _.find(this.props.users, { _id: this.props.params.userId });
  }
  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.dispatch(Actions.getUsers());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.user = _.find(nextProps.users, { _id: nextProps.params.userId });
  }
  renderChildren() {
    if (this.props.children && this.props.users) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { user: this.user, users: this.props.users });
      });
    }
  }
  render() {
    return <div>{this.renderChildren()}</div>;
  }
}

UsersWrapper.need = [
  (params, cookie) => {
    return Actions.getUsers.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    users: store.users,
  };
}

UsersWrapper.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(UsersWrapper);
