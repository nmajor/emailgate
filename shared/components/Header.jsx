import React, { Component, PropTypes } from 'react';
import * as Actions from '../redux/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch(Actions.logoutUser(() => {
      this.context.router.push('/');
    }));
  }
  renderCartBadge() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return <span className="badge">{this.props.cart.items.length}</span>;
    }
  }
  renderCartAction() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return (<Link to="/cart">
        <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>
        {this.renderCartBadge()}
      </Link>);
    }
  }
  renderNavbarHeader() {
    return (<div className="navbar-header">
      <Link className="navbar-brand" to="/">emailgate</Link>
    </div>);
  }
  renderNav() {
    if (!_.isEmpty(this.props.user)) {
      return (<ul className="nav navbar-nav">
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>);
    }
  }
  renderUserActions() {
    if (this.props.user.email) {
      return (<ul className="nav navbar-nav navbar-right">
        <li>{this.renderCartAction()}</li>
        <li><Link to="/dashboard/account">{this.props.user.email}</Link></li>
        <li><a href="#" onClick={this.logout}>Log Out</a></li>
      </ul>);
    }

    return (<ul className="nav navbar-nav navbar-right">
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>);
  }
  render() {
    return (<div className="header">
      <div className="navbar navbar-inverse navbar-static-top header">
        <div className="container-fluid">
          {this.renderNavbarHeader()}
          {this.renderNav()}
          {this.renderUserActions()}
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    cart: store.cart,
  };
}

Header.contextTypes = {
  router: PropTypes.object.isRequired,
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Header);
