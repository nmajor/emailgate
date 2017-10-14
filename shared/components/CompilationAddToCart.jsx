import React, { PropTypes, Component } from 'react';
import { prettyPrice, compilationTotalPageCountEstimate } from '../helpers';
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
    const count = this.props.compilationEmailsCount || _.get(this.props.compilation, 'emails.length');

    return <div>Emails: {count}</div>;
  }
  renderPageCountEstimate() {
    return <div>Estimated Pages: {compilationTotalPageCountEstimate(this.props.compilation)}</div>;
  }
  renderProductOption(productId) {
    const product = _.find(this.props.products, (p) => { return p._id === productId; });

    return (<div className="list-group bottom-bumper col-sm-4">
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
        {this.renderProductOption(4)}
      </div>
    </div>);
  }
  renderCompilationThumb() {
    const { compilation } = this.props;

    if (_.get(compilation, 'thumbnail.url')) {
      return (<img role="presentation" src={compilation.thumbnail.url} />);
    }
  }
  renderCompilationSummary() {
    return (<div className="row bottom-bumper">
      <div className="col-sm-3 relative">
        <div className="summary-compilation-img-thumb">{this.renderCompilationThumb()}</div>
      </div>
      <div className="col-sm-9">
        <div className="padded-box compilation-summary-details">
          <h3 className="margin-topless">{this.props.compilation.title}</h3>
          <h5 className="margin-topless">{this.props.compilation.subtitle}</h5>
          <div className="bottom-bumper">
            {this.renderEmailCount()}
            {this.renderPageCountEstimate()}
          </div>
        </div>
      </div>
    </div>);
  }
  renderSaleBanner() {
    return (<div>
      <div className="clearfix" />
      <div className="checkout-sale-message">
        <div>Your promotional discount of <span className="code">{_.get(this.props.saleSetting, 'value.discount')}%</span> will automatiacally be applied at checkout!</div>
      </div>
    </div>);
  }
  render() {
    return (<div>
      <div className="row">
        <div className="col-sm-12">
          {this.renderCompilationSummary()}
          <hr />
          {this.renderProductOptions()}
          {this.renderSaleBanner()}
          {this.renderAddToCartForm()}
        </div>
      </div>
    </div>);
  }
}

CompilationAddToCart.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilationEmailsCount: PropTypes.number,
  products: PropTypes.array.isRequired,
  submitForm: PropTypes.func.isRequired,
  saleSetting: PropTypes.object.isRequired,
};

export default CompilationAddToCart;
