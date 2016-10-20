import React, { PropTypes, Component } from 'react';
import JsonViewer from '../JsonViewer';

class CompilationView extends Component { // eslint-disable-line
  renderCompilationLogs() {
    if (this.props.compilation.logs) {
      return this.props.compilation.logs.map((entry, index) => {
        return <div key={index}>{JSON.stringify(entry)}</div>;
      });
    }
  }
  renderTopLog() {
    if (this.props.compilation.logs) {
      return this.props.compilation.logs[this.props.compilation.logs.length - 1].message;
    }
  }
  renderPdfLink() {
    if (this.props.compilation.pdf && this.props.compilation.pdf.url) {
      return <a href={this.props.compilation.pdf.url}>Pdf</a>;
    }
  }
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      <div>
        <button className="btn btn-success" onClick={this.props.buildPdf}>Build PDF</button>
        {this.renderPdfLink()}
      </div>
      <div className="bottom-bumper top-bumper">{this.renderTopLog()}</div>
      {this.renderCompilationLogs()}
      <div>
        <JsonViewer obj={this.props.compilation} />
      </div>
    </div>);
  }
}

CompilationView.propTypes = {
  compilation: PropTypes.object.isRequired,
  buildPdf: PropTypes.func.isRequired,
};

export default CompilationView;
