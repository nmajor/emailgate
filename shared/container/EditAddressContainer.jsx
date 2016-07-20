import AddressForm from '../components/AddressForm';
import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class EditAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.back = this.back.bind(this);

    this.address = _.find(this.props.addresses, { _id: this.props.params.id }) || {};
  }

  update(props) {
    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.updateAddress(this.address._id, props, (res) => {
        console.log(res);
        if (res.errors) {
          const errors = {
            _error: 'Could not update address',
          };

          _.forEach(res.errors, (val, key) => {
            errors[key] = val.message;
          });

          reject(errors);
        } else {
          this.back();
          resolve();
        }
      }));
    });
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <h1>Edit Address</h1>
          <AddressForm initialValues={this.address} onSubmit={this.update} back={this.back} submitting={false} states={this.props.config.staticData.states} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    config: store.config,
  };
}

EditAddressContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(EditAddressContainer);
