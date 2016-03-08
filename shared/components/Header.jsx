import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Header extends Component {
  render() {
    return <div className="navbar navbar-inverse navbar-static-top header">
      <div className="container-fluid">
        {this.renderNavbarHeader()}
        {this.renderNav()}
        {this.renderUserActions()}
      </div>
    </div>
  }
  renderNavbarHeader() {
    return <div className="navbar-header">
      <Link className="navbar-brand" to="/">emailgate</Link>
    </div>
  }
  renderNav() {
    return <ul className="nav navbar-nav">
      <li><Link to="/dashboard">Dashboard</Link></li>
    </ul>

    if (this.state.userLoggedIn && this.state.user) {
      return <ul className="nav navbar-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/hobbies/all">Hobbies</Link></li>
        <li><Link to="/admin/hobbies/new">New Hobby</Link></li>
      </ul>
    } else {
      return null;
    }
  }
  renderUserActions() {
    return <ul className="nav navbar-nav navbar-right">
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>

    if (this.state.userLoggedIn && this.state.user) {
      return <ul className="nav navbar-nav navbar-right">
        <li><a className="disabled" href="#">{this.state.user.email}</a></li>
        <li><a href="#" onClick={this.handleLogoutClick}>Log Out</a></li>
      </ul>
    }
  }
}

export default Header;
