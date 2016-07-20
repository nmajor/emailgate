import AddressForm from '../components/AddressForm';
import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class NewAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
  }

  create(props) {
    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.createAddress(props, (res) => {
        if (res.errors) {
          const errors = {
            _error: 'Could not create address',
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
          <h1>New Address</h1>
          <AddressForm onSubmit={this.create} back={this.back} submitting={false} states={this.props.config.staticData.states} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
  };
}

NewAddressContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(NewAddressContainer);
