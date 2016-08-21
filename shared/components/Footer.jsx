import React, { Component } from 'react';
import { Link } from 'react-router';
import CopyrightText from './CopyrightText';


class Footer extends Component {
  renderCopyright() {
    return <div className="copyright"><CopyrightText /></div>;
  }
  renderLinks() {
    return (<div className="links">
      <Link to="/">Home</Link>-
      <Link to="/about">About</Link>-
      <Link to="/terms">Terms</Link>-
      <Link to="/support">Support</Link>
    </div>);
  }
  render() {
    return (<footer>
      {this.renderLinks()}
      {this.renderCopyright()}
    </footer>);
  }
}

export default Footer;
