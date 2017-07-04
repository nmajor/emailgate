import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import JsonViewer from '../JsonViewer';
import covers from '../../../shared/templates/covers';
import CompilationSpineWidthForm from './CompilationSpineWidthForm';
import BuildLogs from './BuildLogs';

import baseURL from '../../../shared/baseURL';

class CompilationView extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.state = {
      compilationEmails: [],
    };
  }
  componentDidMount() {
    fetch(`${baseURL}/api/compilations/${this.props.compilation._id}/emails`, { credentials: 'include' })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }

      this.setState({ compilationEmails: res });
    });
  }
  renderEmailPreviews() {
    return this.state.compilationEmails.map((email) => {
      return (<div className="bottom-bumper">
        <span><strong>{email.subject}</strong></span> - <span>{email.bodyPreview}</span>
      </div>);
    });
  }
  renderErrorLog() {
    if (this.props.compilation.logs) {
      const logs = _.filter(this.props.compilation.logs, { type: 'error' });
      if (logs.length > 0) {
        return <div className="bottom-bumper">ERROR: {logs[logs.length - 1].message}</div>;
      }
    }
  }
  renderPdfLink() {
    if (this.props.compilation.pdf && this.props.compilation.pdf.url) {
      return <a className="btn btn-default right-bumper" target="_blank" href={this.props.compilation.pdf.url}>Compilation Pdf {this.props.compilation.pdf.lastModified ? moment(this.props.compilation.pdf.updatedAt).fromNow() : ''}</a>;
    }
  }
  renderCoverPdfLink() {
    if (this.props.compilation.cover && this.props.compilation.cover.pdf && this.props.compilation.cover.pdf.url) {
      return <a className="btn btn-default right-bumper" target="_blank" href={this.props.compilation.cover.pdf.url}>Cover PDF</a>;
    }
  }
  renderCoverFile() {
    const { compilation } = this.props;
    if (compilation.cover) {
      const template = new covers[compilation.coverTemplate]({ compilation });

      return (<div>
          {template.render()}
      </div>);
    }
  }
  renderPdfActions() {
    if (this.props.compilation.logs) {
      return <BuildLogs logs={this.props.compilation.logs} />;
    }

    return (<div>
      {this.renderPdfLink()}
      <button className="btn btn-success right-bumper" onClick={this.props.buildPdf}>Build PDF</button>
    </div>);
  }
  renderBuildCoverAction() {
    if (!_.get(this.props.compilation, 'cover.spineWidth')) {
      return (<div>
        <hr className="bottom-bumper top-bumper" />
        You must submit the spine width before you can build the cover
      </div>);
    }

    return (<div>
      <hr className="bottom-bumper top-bumper" />
      {this.renderCoverPdfLink()}
      <button className="btn btn-success right-bumper" onClick={this.props.buildCoverPdf}>Build Cover</button>
    </div>);
  }
  renderCoverActions() {
    if (!this.props.compilation.pdf || !this.props.compilation.pdf.pageCount) {
      return 'You must build the compilation pdf before you can build the cover';
    }

    if (this.props.compilation.coverLogs) {
      return <BuildLogs logs={this.props.compilation.coverLogs} />;
    }

    return (<div>
      <CompilationSpineWidthForm compilation={this.props.compilation} submit={this.props.submitSpineWidth} />
      {this.renderBuildCoverAction()}
    </div>);
  }
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box bottom-bumper">
            {this.renderPdfActions()}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box bottom-bumper">
            {this.renderCoverActions()}
          </div>
        </div>
      </div>
      <div>
        <JsonViewer obj={this.props.compilation} />
      </div>
      <div>
        {this.renderEmailPreviews()}
      </div>
      <div>
        {this.renderCoverFile()}
      </div>
    </div>);
  }
}

CompilationView.propTypes = {
  compilation: PropTypes.object.isRequired,
  buildPdf: PropTypes.func.isRequired,
  buildCoverPdf: PropTypes.func.isRequired,
  submitSpineWidth: PropTypes.func.isRequired,
};

export default CompilationView;
