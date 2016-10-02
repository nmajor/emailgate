import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class DashboardContainer extends Component {
  componentDidMount() {
    if (this.props.compilations.length < 1 && !this.props.fetching.compilations) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  render() {
    return (<div className="container-fluid">
      <h1>Dashboard hey</h1>
    </div>);
  }
}

DashboardContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    fetching: store.fetching,
  };
}

DashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DashboardContainer);
