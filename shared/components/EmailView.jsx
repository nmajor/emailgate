import React, { PropTypes, Component } from 'react';
import * as emailTemplate from '../templates/email';

class EmailView extends Component {
  renderView() {
    return (<div className="email-view">
      {emailTemplate.render(this.props.email)}
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
