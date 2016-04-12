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
  componentWillReceiveProps() {
    window.previousLocation = this.props.location;
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

App.need = [
  (params, cookie) => {
    return Actions.getConfig.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    config: store.config,
  };
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(App);
