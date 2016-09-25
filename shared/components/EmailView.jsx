import React, { PropTypes, Component } from 'react';
import EmailTemplate from '../templates/email';

class EmailView extends Component {
  constructor(props, context) {
    super(props, context);
    this.template = new EmailTemplate(this.props.email);
  }
  componentDidMount() {
    if (this.props.scroll) {
      this.refs.view.scrollIntoView(true);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.template = new EmailTemplate(nextProps.email);
  }
  renderView() {
    return (<div ref="view" className="email-view" id={`email-view-${this.props.email._id}`}>
      {this.template.render()}
    </div>);
  }
  render() {
    return this.renderView();
  }
}

EmailView.propTypes = {
  email: PropTypes.object.isRequired,
  scroll: PropTypes.bool,
};

export default EmailView;
