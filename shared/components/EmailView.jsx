import React, { PropTypes, Component } from 'react';
import EmailTemplate from '../templates/email';

class EmailView extends Component {
  constructor(props, context) {
    super(props, context);
    this.template = new EmailTemplate(this.props.email);
  }
  componentWillReceiveProps(nextProps) {
    this.template = new EmailTemplate(nextProps.email);
  }
  renderView() {
    return (<div className="email-view" id={`email-view-${this.props.email._id}`}>
      {this.template.render()}
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
