import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class BuildLogs extends Component { // eslint-disable-line
  renderCompilationLogs() {
    if (this.props.logs) {
      return this.props.logs.map((entry, index) => {
        return <div key={index}>{JSON.stringify(entry)}</div>;
      });
    }
  }
  renderProgressLog() {
    if (this.props.logs) {
      const logs = _.filter(this.props.logs, { type: 'progress' });
      if (logs.length > 0) {
        return <span className="text-bold">{logs[logs.length - 1].message}</span>;
      }
    }
  }
  renderUpdateLog() {
    if (this.props.logs) {
      const logs = _.filter(this.props.logs, (log) => { return ['update', 'status'].indexOf(log.type) > -1; });
      if (logs.length > 0) {
        return logs[logs.length - 1].message;
      }
    }
  }
  renderErrorLog() {
    if (this.props.logs) {
      const logs = _.filter(this.props.logs, { type: 'error' });
      if (logs.length > 0) {
        return <div className="bottom-bumper">ERROR: {logs[logs.length - 1].message}</div>;
      }
    }
  }
  renderBuildLogs() {
    if (this.props.logs) {
      return (<div className="bottom-bumper">
        <h3>Compilation Build Logs</h3>
        <div className="bottom-bumper top-bumper">{this.renderProgressLog()} {this.renderUpdateLog()}</div>
        {this.renderErrorLog()}
        <div className="compilation-logs">
          {this.renderCompilationLogs()}
        </div>
      </div>);
    }
  }
  render() {
    return (<div>{this.renderBuildLogs()}</div>);
  }
}

BuildLogs.propTypes = {
  logs: PropTypes.object.isRequired,
};

export default BuildLogs;
