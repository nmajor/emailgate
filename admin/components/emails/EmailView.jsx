import React, { PropTypes, Component } from 'react';
import EmailTemplate from '../../../shared/templates/book/email';

class EmailView extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.template = new EmailTemplate(this.props.email);
  }
  renderPdfLink() {
    if (this.props.email.pdf && this.props.email.pdf.url) {
      return <a target="_blank" href={this.props.email.pdf.url} className="btn btn-default">PDF</a>;
    }
  }
  render() {
    return (<div>
      {this.template.render()}
      <div>{this.renderPdfLink()}</div>
    </div>);
  }
}

EmailView.propTypes = {
  email: PropTypes.object.isRequired,
};

export default EmailView;
