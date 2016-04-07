import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class AdminContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.props.dispatch(Actions.getAllCompilations());
    this.props.dispatch(Actions.getAllUsers());
  }

  renderChildren() {
    if (this.props.children) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          user: this.props.user,
          allUsers: this.props.allUsers,
          allCompilations: this.props.allCompilations,
        });
      });
    }
  }

  render() {
    return (<div> { this.renderChildren() } </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    allUsers: store.allUsers,
    allCompilations: store.allCompilations,
  };
}

AdminContainer.need = [
  (params, cookie) => {
    return Actions.getAllUsers.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getAllCompilations.bind(null, cookie)();
  },
];

AdminContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  user: PropTypes.object,
  allUsers: PropTypes.array,
  allCompilations: PropTypes.array,
};

export default connect(mapStateToProps)(AdminContainer);
