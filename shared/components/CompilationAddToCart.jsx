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
  renderCartForm() {
    return (<form>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input type="number" name="quantity" className="form-control" id="quantity" value={this.state.quantity} onChange={this.setFormState} />
      </div>
      <button type="submit" className="btn btn-success btn-block" onClick={this.submitForm}>Add to Cart</button>
    </form>);
  }
  renderEmailCount() {
    return (<div>
      Emails: {this.props.compilationEmailsCount}
    </div>);
  }
  renderPdfPageCount() {
    if (this.props.compilation.pdf && this.props.compilation.pdf.pageCount) {
      return (<div>
        Pages: {this.props.compilation.pdf.pageCount}
      </div>);
    }
  }
  renderProductInfo() {
    return (<div>
      <h5>{this.props.products[0].desc}</h5>
      <div>Price: ${prettyPrice(this.props.products[0].price)}</div>
    </div>);
  }
  render() {
    return (<div>
      <h3>{this.props.compilation.name}</h3>
      {this.renderEmailCount()}
      {this.renderPdfPageCount()}
      {this.renderProductInfo()}
      {this.renderCartForm()}
    </div>);
  }
}

CompilationAddToCart.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilationEmailsCount: PropTypes.number.isRequired,
  products: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default CompilationAddToCart;
