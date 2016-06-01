import React, { PropTypes, Component } from 'react';
import { getOrdinalNumber } from '../helpers';
import { Line } from 'rc-progress';

class JobStatus extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderStatus() {
    if (this.props.job.state === 'inactive') {
      return (<div>{getOrdinalNumber(this.props.job.position)} in Queue.</div>);
    }

    return (<div>
      <div>{this.props.job.progress}%</div>
      <Line percent={this.props.job.progress} />
    </div>);
  }
  render() {
    return (<div className="box text-center">
      {this.renderStatus()}
    </div>);
  }
}

JobStatus.propTypes = {
  job: PropTypes.object.isRequired,
};

export default JobStatus;
