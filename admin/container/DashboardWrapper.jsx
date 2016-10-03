import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';

class DashboardWrapper extends Component { // eslint-disable-line
  render() {
    return (<div className="dashboard-wrapper">
      <Header />
      <div className="container">
        {this.props.children}
      </div>
    </div>);
  }
}

DashboardWrapper.propTypes = {
  children: PropTypes.object,
};

export default connect()(DashboardWrapper);
