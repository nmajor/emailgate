import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DashboardWrapper from './DashboardWrapper';

class Home extends Component { // eslint-disable-line
  render() {
    return (<DashboardWrapper>
      <div>Nothing here yet</div>
    </DashboardWrapper>);
  }
}

Home.propTypes = {
  children: PropTypes.object,
};

export default connect()(Home);
