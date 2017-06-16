import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import CartCompilationButton from '../components/CartCompilationButton';

class CartCompilationButtonContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.add = this.add.bind(this);
  }
  compilationProducts() {
    const products = _.filter(this.props.config.products, (product) => {
      return product.tags.indexOf('compilation') > -1;
    });
    return products;
  }
  add(props) {
    this.props.dispatch(Actions.addCartItem(props.productId, props.quantity, {
      compilationId: this.props.compilation._id,
      compilationTitle: this.props.compilation.title,
      compilationSubtitle: this.props.compilation.subtitle,
    }));
  }
  render() {
    return (<CartCompilationButton
      compilation={this.props.compilation}
      addCompilation={this.add}
      products={this.compilationProducts()}
    />);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
  };
}

CartCompilationButtonContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CartCompilationButtonContainer);
