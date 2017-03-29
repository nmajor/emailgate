import React, { PropTypes, Component } from 'react';
import { prettyPrice } from '../helpers';
import _ from 'lodash';

class CompilationAddToCart extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { quantity: 1, productId: 3 };

    this.submitForm = this.submitForm.bind(this);
    this.setFormState = this.setFormState.bind(this);
  }
  setProductId(productId) {
    this.setState({ productId });
  }
  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;
    this.setState(newState);
  }
  submitForm(e) {
    e.preventDefault();

    this.props.submitForm(this.state);
  }
  renderAddToCartForm() {
    return (<form>
      <label htmlFor="quantity">How many copies would you like to order?</label>
      <div className="form-group">
        <input type="number" name="quantity" className="form-control" id="quantity" value={this.state.quantity} onChange={this.setFormState} />
      </div>
      <button type="submit" className="btn btn-success btn-block" onClick={this.submitForm}>Add to Cart</button>
    </form>);
  }
  renderEmailCount() {
    return <div>Emails: {this.props.compilationEmailsCount}</div>;
  }
  renderPageCountEstimate() {
    return <div>Estimated Pages: {this.props.compilationTotalPageCountEstimate}</div>;
  }
  renderProductOption(productId) {
    const product = _.find(this.props.products, (p) => { return p._id === productId; });

    return (<div className="list-group bottom-bumper">
      <div className={`list-group-item product-option ${productId === this.state.productId ? 'active' : ''}`} onClick={() => { this.setProductId(productId); }}>
        <h5>{product.desc}</h5>
        <div>Price: ${prettyPrice(product.price)}/each</div>
      </div>
    </div>);
  }
  renderProductOptions() {
    return (<div>
      <label htmlFor="quantity">Please select print type?</label>
      <div className="list-group">
        {this.renderProductOption(3)}
        {this.renderProductOption(1)}
      </div>
    </div>);
  }
  render() {
    return (<div>
      <div className="row">
        <div className="col-sm-12">
          <h3 className="margin-topless">{this.props.compilation.title}</h3>
          <div className="bottom-bumper">
            {this.renderEmailCount()}
            {this.renderPageCountEstimate()}
          </div>
          {this.renderProductOptions()}
          {this.renderAddToCartForm()}
        </div>
      </div>
    </div>);
  }
}

CompilationAddToCart.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilationEmailsCount: PropTypes.number.isRequired,
  compilationTotalPageCountEstimate: PropTypes.number.isRequired,
  products: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default CompilationAddToCart;
