import React, { PropTypes, Component } from 'react';
import EmailTemplate, { addEmbeddedAttachmentsToEmailBody } from '../templates/email';

class EmailView extends Component {
  constructor(props, context) {
    super(props, context);

    if (props.dontEmbed) {
      this.template = new EmailTemplate(props.email);
    } else {
      this.template = new EmailTemplate(addEmbeddedAttachmentsToEmailBody(props.email));
    }
  }
  componentDidMount() {
    if (this.props.scroll) {
      this.refs.view.scrollIntoView(true);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dontEmbed) {
      this.template = new EmailTemplate(nextProps.email);
    } else {
      this.template = new EmailTemplate(addEmbeddedAttachmentsToEmailBody(nextProps.email));
    }
  }
  renderView() {
    return (<div ref="view" className={`email-view ${this.props.disabled ? 'disabled' : ''}`} id={`email-view-${this.props.email._id}`}>
      <div className="email-container">
        {this.template.render()}
      </div>
    </div>);
  }
  render() {
    return this.renderView();
  }
}

EmailView.propTypes = {
  email: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  scroll: PropTypes.bool,
  dontEmbed: PropTypes.bool,
};

export default EmailView;
