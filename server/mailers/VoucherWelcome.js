import React from 'react';
import { renderToString } from 'react-dom/server';
import { layoutWrapper } from './helper';
import products from '../products';
import _ from 'lodash';

class VoucherSummary {
  constructor(props) {
    this.props = props;
  }
  renderVoucherProducts() {
    return this.props.promoCode.productVouchers.map((voucher, index) => {
      const product = _.find(products, { _id: parseInt(voucher.productId, 10) });
      return <p key={index}>{voucher.quantity} x {product.desc}</p>;
    });
  }
  render() {
    // <img src="https://www.missionarymemoir.com/wp-content/uploads/2017/11/Enter-this-code-upon-check-out-1.png" role="presentation" />
    return (<table className="body-wrap">
      <tbody>
        <tr>
          <td />
          <td className="container">
            <div className="content">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <p><img src="https://www.missionarymemoir.com/wp-content/uploads/2017/11/cheers-2.png" role="presentation" /></p>
                      <br />
                      <h3>Yay!</h3>
                      <p className="lead">We're thrilled you've decided to let us help you preserve your precious mission memories!</p>
                      <br />
                      <h3 className="center">Your gift card is now available!</h3>
                      <div className="voucher-code">
                        <div className="code-outer">
                          <div className="code-inner">
                            <h3>Gift Card Voucher Code:</h3>
                            <span className="code-text">{this.props.promoCode.code}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ border: '1px solid #CCC', padding: '10px', marginBottom: '10px' }}>
                        <p className="lead">This voucher code <span style={{ fontWeight: 'bold' }}>{this.props.promoCode.code}</span> can be redeemed at checkout, and entitles you to the following products:</p>
                        {this.renderVoucherProducts()}
                      </div>
                      <br />
                      <div className="center">
                        <h3>Now You Can Build Your Mission Book!</h3>
                        <a href="https://app.missionarymemoir.com/register" className="btn">Click here to get started!</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
          <td />
        </tr>
      </tbody>
    </table>);
  }
  toString() {
    // #4ABDAC
    const headerStyles = `
      .voucher-code {
        text-align: center;
        margin-bottom: 20px;
        color: #444;
      }
      .voucher-code h3 {
        color: #444;
        font-family: "Times New Roman", Times, serif;
      }
      .code-outer {
        border: 3px solid #444;
        padding: 20px;
      }
      .code-inner {
        border: 1px solid #444;
        padding: 40px 15px;
      }
      .code-text {
        font-size: 40px;
        font-weight: 600;
      }
      @media only screen and (max-width: 550px) {
        .code-text {
          top: -170px;
        }
      }
      @media only screen and (max-width: 450px) {
        .code-text {
          top: -130px;
          font-size: 30px;
        }
      }
    `;
    return layoutWrapper(renderToString(this.render()), headerStyles);
  }
}

export default VoucherSummary;
