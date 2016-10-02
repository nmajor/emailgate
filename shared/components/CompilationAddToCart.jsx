import React, { PropTypes, Component } from 'react';
import { prettyPrice } from '../helpers';

class CompilationAddToCart extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { quantity: 1 };

    this.submitForm = this.submitForm.bind(this);
    this.setFormState = this.setFormState.bind(this);
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
  renderProductDesc() {
    return <h5>{this.props.products[0].desc}</h5>;
  }
  renderProductInfo() {
    return (<div>Price: ${prettyPrice(this.props.products[0].price)}/each</div>);
  }
  render() {
    return (<div>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box">
            <h3 className="margin-topless text-center">{this.props.compilation.title}</h3>
            {this.renderProductDesc()}
            {this.renderEmailCount()}
            {this.renderPageCountEstimate()}
            {this.renderProductInfo()}
          </div>
        </div>
        <div className="col-sm-6">
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
