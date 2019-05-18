import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class EmailPdfButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.rebuildPdf = this.rebuildPdf.bind(this);
    this.rebuildPdfDocker = this.rebuildPdfDocker.bind(this);
  }
  hasValidPdf() {
    return this.props.email.pdf && this.props.email.fullHtmlSha1 && this.props.email.pdf.htmlSha1 === this.props.email.fullHtmlSha1;
  }
  rebuildPdf() {
    this.props.rebuildPdf('email', this.props.email._id);
  }
  rebuildPdfDocker() {
    this.props.rebuildPdf('email', this.props.email._id, 'docker');
  }
  renderPdfAction() {
    if (_.get(this.props.email, 'pdf.url') && this.props.user.isAdmin) {
      return (<a target="_blank" className="btn btn-primary" href={this.props.email.pdf.url}>
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> PDF
      </a>);
    }
  }
  renderRebuildPdfAction() {
    if (this.props.user.isAdmin && !this.hasValidPdf()) {
      return (<span className="btn btn-success" onClick={this.rebuildPdf}>
        <span><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> PDF</span>
      </span>);
    }
  }
  renderRebuildPdfDockerAction() {
    if (this.props.user.isAdmin && !this.hasValidPdf()) {
      return (<span className="btn btn-success" onClick={this.rebuildPdfDocker}>
        <span><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> PDF Dock</span>
      </span>);
    }
  }
  renderRebuildButtons() {
    if (this.props.email.rebuilding) {
      return (<span className="btn btn-success" onClick={this.rebuildPdfDocker}>
        <span>Rebuilding</span>
      </span>);
    }

    return (<div>
      {this.renderRebuildPdfAction()}
      {this.renderRebuildPdfDockerAction()}
    </div>);
  }
  render() {
    return (<div style={{ display: 'flex' }}>
      {this.renderRebuildButtons()}
      {this.renderPdfAction()}
    </div>);
  }
}

EmailPdfButton.propTypes = {
  email: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  rebuildPdf: PropTypes.func,
};

export default EmailPdfButton;
