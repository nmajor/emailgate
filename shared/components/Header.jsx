import React, { Component, PropTypes } from 'react';
import * as Actions from '../redux/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      collapsed: true,
    };

    this.logout = this.logout.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  logout() {
    this.props.dispatch(Actions.logoutUser(() => {
      this.context.router.push('/');
    }));
  }
  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }
  renderCartBadge() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return <span className="badge">{this.props.cart.items.length}</span>;
    }
  }
  renderCartAction() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return (<Link to="/cart">
        <span className="hidden-xs">
          <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> {this.renderCartBadge()}
        </span>
        <span className="visible-xs">Cart {this.renderCartBadge()}</span>
      </Link>);
    }
  }
  renderNavbarHeader() {
    return (<div className="navbar-header">
      <Link className="navbar-brand" to="/">emailgate</Link>
      <div className="navbar-toggle" onClick={this.toggleCollapsed}>{this.renderExpandIcon()}</div>
    </div>);
  }
  renderNavItem(path, text) {
    const className = `visible-xs ${this.props.currentPath === path ? 'active' : ''}`;
    return <li className={className}><Link to={path}>{text}</Link></li>;
  }
  renderNav() {
    if (!_.isEmpty(this.props.user.email)) {
      return (<ul className="nav navbar-nav">
        <li><Link to="/dashboard">Dashboard</Link></li>
        {this.renderNavItem('/dashboard', 'Summary')}
        {this.renderNavItem('/dashboard/compilations', 'Compilations')}
        {this.renderNavItem('/dashboard/email-accounts', 'Email Accounts')}
        {this.renderNavItem('/dashboard/orders', 'Orders')}
        {this.renderNavItem('/dashboard/account', 'Manage Account')}
      </ul>);
    }
  }
  renderUserActions() {
    if (this.props.user.email) {
      return (<ul className="nav navbar-nav navbar-right">
        <li>{this.renderCartAction()}</li>
        <li className="hidden-xs"><Link to="/dashboard/account">{this.props.user.email}</Link></li>
        <li><a href="#" onClick={this.logout}>Log Out</a></li>
      </ul>);
    }

    return (<ul className="nav navbar-nav navbar-right">
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>);
  }
  renderExpandIcon() {
    return <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>;
  }
  renderCollapsibleNavContent() {
    if (this.state.collapsed) {
      return (<div className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid">
          {this.renderNavbarHeader()}
        </div>
      </div>);
    }

    return (<div className="navbar navbar-inverse navbar-static-top">
      <div className="container-fluid">
        {this.renderNavbarHeader()}
        {this.renderNav()}
        {this.renderUserActions()}
      </div>
    </div>);
  }
  renderCollapsibleNav() {
    return <div className="visible-xs">{this.renderCollapsibleNavContent()}</div>;
  }
  renderNormalNav() {
    return (<div className="hidden-xs ">
      <div className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid">
          {this.renderNavbarHeader()}
          {this.renderNav()}
          {this.renderUserActions()}
        </div>
      </div>
    </div>);
  }
  render() {
    return (<div className="header">
      {this.renderNormalNav()}
      {this.renderCollapsibleNav()}
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
  currentPath: PropTypes.string,
};

export default connect(mapStateToProps)(Header);
