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
  renderAttributions() {
    return (<div className="attribution">
      Emojis by <a href="https://twitter.com">Twitter</a> through <a href="https://github.com/twitter/twemoji">twemoji</a> licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>
    </div>);
  }
  render() {
    return (<footer>
      {this.renderLinks()}
      {this.renderCopyright()}
      {this.renderAttributions()}
    </footer>);
  }
}

export default Footer;
