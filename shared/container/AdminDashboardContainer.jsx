import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import AdminDashboard from '../components/AdminDashboard';
import Header from '../components/Header';

class AdminDashboardContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<div>
      <Header />
      <AdminDashboard
        users={this.props.allUsers}
        compilations={this.props.allCompilations}
      />
    </div>);
  }
}

AdminDashboardContainer.propTypes = {
  allUsers: PropTypes.array.isRequired,
  allCompilations: PropTypes.array.isRequired,
};

export default connect()(AdminDashboardContainer);
