import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import JsonViewer from '../JsonViewer';
import DustJacketCover from '../../../shared/templates/dustJacketCover';

class CompilationView extends Component { // eslint-disable-line
  renderCompilationLogs() {
    if (this.props.compilation.logs) {
      return this.props.compilation.logs.map((entry, index) => {
        return <div key={index}>{JSON.stringify(entry)}</div>;
      });
    }
  }
  renderProgressLog() {
    if (this.props.compilation.logs) {
      const logs = _.filter(this.props.compilation.logs, { type: 'progress' });
      if (logs.length > 0) {
        return <span className="text-bold">{logs[logs.length - 1].message}</span>;
      }
    }
  }
  renderUpdateLog() {
    if (this.props.compilation.logs) {
      const logs = _.filter(this.props.compilation.logs, (log) => { return ['update', 'status'].indexOf(log.type) > -1; });
      if (logs.length > 0) {
        return logs[logs.length - 1].message;
      }
    }
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
      return <a className="btn btn-default" href={this.props.compilation.pdf.url}>Compilation Pdf</a>;
    }
  }
  renderCoverPdfLink() {
    if (this.props.compilation.pdf && this.props.compilation.pdf.url) {
      return <a className="btn btn-default" href={this.props.compilation.pdf.url}>Cover PDF</a>;
    }
  }
  renderBuildLogs() {
    if (this.props.compilation.logs) {
      return (<div className="bottom-bumper">
        <h3>Build Logs</h3>
        <div className="bottom-bumper top-bumper">{this.renderProgressLog()} {this.renderUpdateLog()}</div>
        {this.renderErrorLog()}
        <div className="compilation-logs">
          {this.renderCompilationLogs()}
        </div>
      </div>);
    }
  }
  renderCoverFile() {
    const template = new DustJacketCover({ compilation: this.props.compilation });
    return template.render();
  }
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      {this.renderBuildLogs()}
      <div>
        {this.renderPdfLink()}
        {this.renderCoverPdfLink()}
      </div>
      <div>
        <button className="btn btn-success right-bumper" onClick={this.props.buildPdf}>Build PDF</button>
        <button className="btn btn-success right-bumper" onClick={this.props.buildPdf}>Build Cover</button>
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
};

export default CompilationView;
