import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AddressListContainer from '../container/AddressListContainer';

class AddressesDashboardContainer extends Component {
  componentDidMount() {
    if (this.props.addresses.length < 1 && !this.props.fetching.addresses) {
      this.props.dispatch(Actions.getAddresses());
    }
  }
  render() {
    return (<div className="container-fluid">
      <h1 className="hdash">Addresses</h1>
      <div className="row">
        <div className="col-md-6">
          <AddressListContainer />
        </div>
      </div>
    </div>);
  }
}

AddressesDashboardContainer.need = [
  (params, cookie) => {
    return Actions.getAddresses.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    fetching: store.fetching,
  };
}

AddressesDashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddressesDashboardContainer);
