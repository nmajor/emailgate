import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    if (_.isEmpty(this.props.config)) {
      this.props.dispatch(Actions.getConfig());
    }
  }
  componentWillMount() {
    if (window.location.search) {
      this.context.router.push(window.location.pathname);
    }
  }
  componentWillReceiveProps() {
    window.previousLocation = this.props.location;

    if (_.isEmpty(this.props.config)) {
      this.props.dispatch(Actions.getConfig());
    }

    if (!_.isEmpty(this.props.user) && this.props.cart._user !== this.props.user._id) {
      this.props.dispatch(Actions.getCart());
    }
  }

  render() {
    return (<div>
      {this.props.children}
    </div>);
  }
}

App.need = [
  (params, cookie) => {
    return Actions.getConfig.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCart.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    config: store.config,
    user: store.user,
    cart: store.cart,
  };
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(App);
