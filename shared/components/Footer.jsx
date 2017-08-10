import React, { Component } from 'react';
import { Link } from 'react-router';
import CopyrightText from './CopyrightText';


class Footer extends Component {
  renderCopyright() {
    return <div className="copyright"><CopyrightText /></div>;
  }
  renderLinks() {
    return (<div className="links">
      <Link to="https://www.missionarymemoir.com">Home</Link>-
      <Link to="/about">About</Link>-
      <Link to="/terms">Terms and Conditions</Link>-
      <Link to="/privacy">Privacy Policy</Link>-
      <a target="_blank" href="https://missionarymemoir.freshdesk.com/support/tickets/new">Contact Us</a>
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
