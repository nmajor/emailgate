import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class Home extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    return (<div>Hi from home</div>);
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
};

export default connect()(Home);
