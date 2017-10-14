import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import { prettyPrice, buffCart } from '../../shared/helpers';
// import _ from 'lodash';

class ActivitySummary {
  constructor(props) {
    this.props = props;
  }
  renderOrderCardList() {
    return this.props.orders.map((order) => {
      const newOrder = buffCart(order);
      console.log('blah hey', newOrder);
      return (<div
        style={{
          background: '#FFF',
          padding: '22px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          border: '1px solid #CCC',
          marginBottom: '10px',
        }}
      >
        Amount: ${prettyPrice(order.amount)}
        Tax: ${prettyPrice(order.tax)}
        Shipping: ${prettyPrice(order.shipping)}
        Discount: ${prettyPrice(order.discount)} from promo code {order._promoCode}
      </div>);
    });
  }
  renderCompilationCardList() {
    return this.props.compilations.map((compilation) => {
      const adminLink = `https://admin.missionarymemoir.com/compilations/${compilation._id}`;

      return (<div
        style={{
          background: '#FFF',
          padding: '22px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          border: '1px solid #CCC',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
          }}
        >
          <img
            style={{
              border: '1px solid #ccc',
              verticalAlign: 'inherit',
              maxWidth: '50px',
              maxHeight: '80px',
              marginRight: '10px',
            }}
            role="presentation"
            src={compilation.thumbnail.url}
          />
        </div>
        <div
          style={{
            height: '80px',
            display: 'inline-block',
            marginLeft: '60px',
          }}
        >
          <a href={adminLink}>{compilation.title}</a>
          <div>{compilation.emails.length} emails</div>
          <div>Created By: {compilation._user.name} - {compilation._user.email}</div>
        </div>
      </div>);
    });
  }
  renderCompilationSummary() {
    return (<div>
      <h3>Compilations Created: {this.props.compilations.length}</h3>
      {this.renderCompilationCardList()}
    </div>);
  }
  renderUserSummary() {
    return (<div>
      <h3>Users Created: {this.props.users.length}</h3>
    </div>);
  }
  renderOrderSummary() {
    return (<div>
      <h3>Orders Created: {this.props.orders.length}</h3>
      {this.renderOrderCardList()}
    </div>);
  }
  render() {
    return (<div style={{ padding: '40px' }}>
      <h1>Activity Summary for {moment(this.props.yesterday).format('dddd MMM Do, YYYY')}</h1>
      {this.renderOrderSummary()}
      {this.renderCompilationSummary()}
      {this.renderUserSummary()}
    </div>);
  }
  toString() {
    return `
<html>
  <head>
    <meta charset="utf8">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
  ${renderToString(this.render())}
  </body>
</html>
    `;
  }
}

export default ActivitySummary;
