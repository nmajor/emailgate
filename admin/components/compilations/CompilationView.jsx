import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
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
      compilationPages: [],
    };

    this.resaveAllComponents = this.resaveAllComponents.bind(this);
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

    fetch(`${baseURL}/api/compilations/${this.props.compilation._id}/pages`, { credentials: 'include' })
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

      this.setState({ compilationPages: res });
    });
  }
  resaveAllComponents() {
    this.props.resaveAllComponents();
  }
  renderEmailPreviews() {
    return this.state.compilationEmails.map((email) => {
      return (<div className="bottom-bumper">
        <div>{moment(email.date).format('LL')}</div>
        <span><strong>{email.subject}</strong></span> - <span>{email.bodyPreview}</span>
      </div>);
    });
  }
  renderEmailPdfStatus() {
    return this.state.compilationEmails.map((email) => {
      console.log('blah hi', email.fullHtmlSha1, email.pdf, email.pdf.url, email.pdf.htmlSha1);
      if (email.fullHtmlSha1 && email.pdf && email.pdf.url && email.pdf.htmlSha1 && email.fullHtmlSha1 === email.pdf.htmlSha1) {
        return <div className="text-success">0</div>;
      }
      if (email.fullHtmlSha1 && email.pdf && email.pdf.url && email.pdf.htmlSha1 && email.fullHtmlSha1 !== email.pdf.htmlSha1) {
        return <div className="text-warning">0</div>;
      }
      return <a target="_blank" href={`${location.origin.replace('admin.', '')}/compilations/${email._compilation}/build/emails/${email._id}`} className="text-danger">X</a>;
    });
  }
  renderPagePdfStatus() {
    return this.state.compilationPages.map((page) => {
      if (page.fullHtmlSha1 && page.pdf && page.pdf.url && page.pdf.htmlSha1 && page.fullHtmlSha1 === page.pdf.htmlSha1) {
        return <div className="text-success">0</div>;
      } if (page.type === 'cover') {
        return null;
      }
      return <a target="_blank" href={`${location.origin.replace('admin.', '')}/compilations/${page._compilation}/build/emails/${page._id}`} className="text-danger">X</a>;
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
      return <a className="btn btn-default right-bumper" target="_blank" href={this.props.compilation.pdf.url}>Compilation Pdf {moment(this.props.compilation.pdf.updatedAt || this.props.compilation.pdf.meta.updatedAt).fromNow()}</a>;
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
      const template = new covers[compilation.coverTemplate]({ compilation, showBleed: false });

      return (<div>
          {template.render()}
      </div>);
    }
  }
  renderCompilationLogs() {
    if (this.props.compilation.logs) {
      return (<div className="padded-box bottom-bumper">
        <BuildLogs header="Compilation Logs" logs={this.props.compilation.logs} clearLogs={this.props.clearCompilationLogs} />
      </div>);
    }
  }
  renderPdfActions() {
    return (<div>
      {this.renderPdfLink()}
      <button className="btn btn-success right-bumper" onClick={this.props.compilePdfs}>Compile PDFs</button>
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

    return (<div>
      <CompilationSpineWidthForm compilation={this.props.compilation} submit={this.props.submitSpineWidth} />
      {this.renderBuildCoverAction()}
    </div>);
  }
  renderCompilationBuildLink() {
    try {
      if (!window) { return null; }
    } catch (err) { return null; } // eslint-disable-line

    let host = window.location.host.replace('admin.', '');

    if (window.location.hostname === 'admin.missionarymemoir.com') {
      host = window.location.host.replace('admin.', 'app.');
    }


    return <a className="btn btn-warning bottom-bumper right-bumper" href={`${window.location.protocol}//${host}/compilations/${this.props.compilation._id}/build`}>Edit</a>;
  }
  renderResaveAllComponentsAction() {
    return <div className="btn btn-success bottom-bumper right-bumper" onClick={this.resaveAllComponents}>Resave All Components</div>;
  }
  renderCoverHtml() {
    if (this.props.compilation.cover && this.props.compilation.cover.html) {
      return (<div>
        <h3>Literal Cover Html</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.compilation.cover.html }} />
      </div>);
    }
  }
  render() {
    if (!this.props.compilation) { return <div>No compilation</div>; }
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      <div>
        {this.renderCompilationBuildLink()}
        {this.renderResaveAllComponentsAction()}
        <button className="btn btn-success bottom-bumper right-bumper" onClick={this.props.buildEmailPdfs}>Build Email PDFs</button>
        <button className="btn btn-success bottom-bumper right-bumper" onClick={this.props.buildEmailPdfsDocker}>Build Email PDFs Docker</button>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box bottom-bumper">
            <div>Pages</div>
            <div style={{ display: 'flex' }}>{this.renderPagePdfStatus()}</div>
            <div>Emails</div>
            <div style={{ display: 'flex' }}>{this.renderEmailPdfStatus()}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box bottom-bumper">
            {this.renderPdfActions()}
          </div>
          <div className="padded-box bottom-bumper">
            {this.renderCoverActions()}
          </div>
          <div className="padded-box bottom-bumper">
            <JsonViewer obj={this.props.compilation} />
          </div>
        </div>
        <div className="col-sm-6">
          {this.renderCompilationLogs()}
        </div>
      </div>
      <hr />
      <div>
        {this.renderEmailPreviews()}
      </div>
      <div>
        {this.renderCoverFile()}
      </div>
      {this.renderCoverHtml()}
    </div>);
  }
}

CompilationView.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilePdfs: PropTypes.func.isRequired,
  buildEmailPdfsDocker: PropTypes.func.isRequired,
  buildEmailPdfs: PropTypes.func.isRequired,
  buildCoverPdf: PropTypes.func.isRequired,
  submitSpineWidth: PropTypes.func.isRequired,
  resaveAllComponents: PropTypes.func.isRequired,
  clearCompilationLogs: PropTypes.func.isRequired,
};

export default CompilationView;
