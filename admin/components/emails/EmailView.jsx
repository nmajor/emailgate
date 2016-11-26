import React, { PropTypes, Component } from 'react';
import EmailTemplate from '../../../shared/templates/email';

class EmailView extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.template = new EmailTemplate(this.props.email);
  }
  render() {
    return (<div>
      {this.template.render()}
    </div>);
  }
}

EmailView.propTypes = {
  email: PropTypes.object.isRequired,
};

export default EmailView;
