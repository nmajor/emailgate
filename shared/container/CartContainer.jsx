import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import CartFormContainer from './CartFormContainer';
import Header from '../components/Header';

class CartContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (<div>
      <Header />
      <div className="container">
        <CartFormContainer />
      </div>
    </div>);
  }
}

// function mapStateToProps(store) {
//   return {
//     config: store.config,
//     cart: store.cart,
//   };
// }

CartContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CartContainer);
