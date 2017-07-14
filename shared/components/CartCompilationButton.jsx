import React, { PropTypes, Component } from 'react';
import CompilationAddToCart from './CompilationAddToCart';
import Modal from './Modal';

class CartCompilationButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      modalVisible: false,
    };

    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.addCompilation = this.addCompilation.bind(this);
  }
  addCompilation(props) {
    this.props.addCompilation(props);
    this.hideModal(props);
  }
  hideModal() {
    this.setState({ modalVisible: false });
  }
  showModal() {
    this.setState({ modalVisible: true });
  }
  renderModal() {
    if (this.state.modalVisible) {
      return (<Modal close={this.hideModal}>
        <div className="padded">
          <h1 className="text-center">Add To Cart</h1>
          <CompilationAddToCart
            compilation={this.props.compilation}
            submitForm={this.addCompilation}
            products={this.props.products}
          />
        </div>
      </Modal>);
    }
  }
  render() {
    return (<div className="btn btn-success btn-xs" onClick={this.showModal}>
      {this.renderModal()}
      <span className="glyphicon glyphicon-shopping-cart right-bumper" aria-hidden="true"></span>
      Add to Cart
    </div>);
  }
}

CartCompilationButton.propTypes = {
  compilation: PropTypes.object.isRequired,
  addCompilation: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default CartCompilationButton;
