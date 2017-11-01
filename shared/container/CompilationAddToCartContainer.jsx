import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationAddToCart from '../components/CompilationAddToCart';

class CompilationAddToCartContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.sitewideSaleSetting = _.find(props.config.settings, (setting) => { return setting.name === 'sitewideSale'; });
  }
  render() {
    return (<CompilationAddToCart
      compilation={this.props.compilation}
      compilationEmailsCount={this.props.compilationEmailsCount}
      submitForm={this.props.submitForm}
      products={this.props.products}
      saleSetting={this.sitewideSaleSetting}
    />);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
  };
}

CompilationAddToCartContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmailsCount: PropTypes.number,
  products: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(CompilationAddToCartContainer);
