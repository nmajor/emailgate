import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import CompilationCard from '../components/CompilationCard';
import CartViewContainer from './CartViewContainer';
import Footer from '../components/Footer';
import Header from '../components/Header';

class CartContainer extends Component {
  // constructor(props, context) {
  //   super(props, context);
  // }
  componentDidMount() {
    if (this.props.compilations.length < 1 && !this.props.fetching.compilations) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  renderViewAllAction() {
    if (this.props.compilations.length > 6) {
      return (<div className="col-md-4">
        <Link className="btn btn-default btn-block" to="/dashboard/compilations">
          See all compilations
        </Link>
      </div>);
    }
  }
  renderComilationCartCards() {
    const compilations = _.sortBy(this.props.compilations, 'updatedAt').reverse();
    const cartNum = compilations.length > 6 ? 5 : 6;

    return compilations.slice(0, cartNum).map((compilation, index) => {
      return (<div key={index} className="col-md-4">
        <CompilationCard compilation={compilation} />
      </div>);
    });
  }
  render() {
    return (<div>
      <Header hideCart />
      <div className="container top-bumper">
        <div className="row">
          {this.renderComilationCartCards()}
          {this.renderViewAllAction()}
        </div>
      </div>
      <div className="container">
        <div className="content-box bottom-bumper">
          <h1>Cart</h1>
          <CartViewContainer />
        </div>
      </div>
      <Footer />
    </div>);
  }
}

CartContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    compilations: store.compilations,
  };
}

CartContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CartContainer);
