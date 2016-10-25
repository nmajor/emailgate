import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import JsonViewer from '../JsonViewer';
import CaseboundCover from '../../../shared/templates/caseboundCover';
import BuildLogs from './BuildLogs';

class CompilationView extends Component { // eslint-disable-line
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
      return <a className="btn btn-default" href={this.props.compilation.pdf.url}>Compilation Pdf</a>;
    }
  }
  renderCoverPdfLink() {
    if (this.props.compilation.cover && this.props.compilation.cover.pdf && this.props.compilation.cover.pdf.url) {
      return <a className="btn btn-default" href={this.props.compilation.cover.pdf.url}>Cover PDF</a>;
    }
  }
  renderBuildLogs() {
    if (this.props.compilation.logs) {
      return <BuildLogs logs={this.props.compilation.logs} />;
    }
  }
  renderCoverBuildLogs() {
    if (this.props.compilation.coverLogs) {
      return <BuildLogs logs={this.props.compilation.coverLogs} />;
    }
  }
  renderCoverFile() {
    const template = new CaseboundCover({ compilation: this.props.compilation });
    return template.render();
  }
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      {this.renderBuildLogs()}
      {this.renderCoverBuildLogs()}
      <div>
        {this.renderPdfLink()}
        {this.renderCoverPdfLink()}
      </div>
      <div>
        <button className="btn btn-success right-bumper" onClick={this.props.buildPdf}>Build PDF</button>
        <button className="btn btn-success right-bumper" onClick={this.props.buildCoverPdf}>Build Cover</button>
      </div>
      <div>
        <JsonViewer obj={this.props.compilation} />
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
};

export default CompilationView;
