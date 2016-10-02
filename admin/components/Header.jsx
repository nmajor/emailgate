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
    this.forceCollapse = this.forceCollapse.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  logout() {
    this.props.dispatch(Actions.logoutUser(() => {
      this.context.router.push('/');
    }));
    this.forceCollapse();
  }
  forceCollapse() {
    this.setState({ collapsed: true });
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
    if (!this.props.hideCart && _.get(this.props.cart, 'items.length') > 0) {
      return (<Link to="/cart" onClick={this.forceCollapse}>
        <span className="hidden-xs">
          <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> {this.renderCartBadge()}
        </span>
        <span className="visible-xs">Cart {this.renderCartBadge()}</span>
      </Link>);
    }
  }
  renderNavbarHeader() {
    return (<div className="navbar-header">
      <Link className="navbar-brand" to="/">MYEMAILBOOK.COM</Link>
      <div className="navbar-toggle" onClick={this.toggleCollapsed}>{this.renderExpandIcon()}</div>
    </div>);
  }
  renderNavItem(path, text) {
    const className = `${this.props.currentPath === path ? 'active' : ''}`;
    return <li className={className}><Link to={path} onClick={this.forceCollapse}>{text}</Link></li>;
  }
  renderNav() {
    if (!_.isEmpty(this.props.user.email)) {
      return (<ul className="nav navbar-nav">
        {this.renderNavItem('/users', 'Users')}
        {this.renderNavItem('/compilations', 'Compilations')}
        {this.renderNavItem('/orders', 'Orders')}
        {this.renderNavItem('/purchase-orders', 'Purchase Orders')}
      </ul>);
    }
  }
  renderUserActions() {
    if (this.props.user.email) {
      return (<ul className="nav navbar-nav navbar-right">
        <li className="hidden-xs"><Link to="/dashboard/account" onClick={this.forceCollapse}>{this.props.user.email}</Link></li>
        <li><a href="#" onClick={this.logout}>Log Out</a></li>
      </ul>);
    }

    return (<ul className="nav navbar-nav navbar-right">
      <li><Link to="/login" onClick={this.forceCollapse}>Login</Link></li>
      <li><Link to="/register" onClick={this.forceCollapse}>Register</Link></li>
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
  hideCart: PropTypes.bool,
  currentPath: PropTypes.string,
};

export default connect(mapStateToProps)(Header);
