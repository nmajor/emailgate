import AddressForm from '../components/AddressForm';
import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class NewAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
  }

  create(props) {
    this.props.dispatch(Actions.createAddress(props, () => {
      this.back();
    }));
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
          <AddressForm onSubmit={this.create} submitting={false} />
        </div>
      </div>
    );
  }
}

NewAddressContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NewAddressContainer);
