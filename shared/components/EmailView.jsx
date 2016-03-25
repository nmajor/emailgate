import React, { PropTypes, Component } from 'react';
import * as sharedHelpers from '../helpers';

class EmailView extends Component {
  renderView() {
    const emailParts = sharedHelpers.pageEmailParts(this.props.email);

    return (<div className="email-view">
      {emailParts.subject}
      {emailParts.date}
      {emailParts.from}
      {emailParts.to}
      {emailParts.body}
    </div>);
  }
  render() {
    return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}

EmailView.propTypes = {
  email: PropTypes.object.isRequired,
};

export default EmailView;
