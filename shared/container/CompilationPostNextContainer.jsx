import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationPostNextContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.userNeedsAuth = this.userNeedsAuth.bind(this);
    this.cartHasCompilation = this.cartHasCompilation.bind(this);
  }
  componentWillMount() {
    if (this.userNeedsAuth()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/register/post`);
    } else if (!this.cartHasCompilation()) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/checkout`);
    } else {
      this.context.router.push('/cart');
    }
  }
  userNeedsAuth() {
    return this.props.user.isTmp;
  }
  cartHasCompilation() {
    const items = this.props.cart.items || [];
    return _.some(items, (item) => { return item.props.compilationId === this.props.compilation._id; });
  }
  render() {
    return (<div></div>);
  }
}

function mapStateToProps(store) {
  return {
    cart: store.cart,
    user: store.user,
  };
}

CompilationPostNextContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPostNextContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationPostNextContainer);
