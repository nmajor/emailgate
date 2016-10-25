import React, { PropTypes, Component } from 'react';
// import _ from 'lodash';
import moment from 'moment';
import JsonViewer from '../JsonViewer';

class PurchaseOrderResponse extends Component { // eslint-disable-line
  render() {
    return (<div className="padded-box bottom-bumper">
      <div>[{this.props.response.status}] {moment(this.props.response.createdAt).fromNow()} - {moment(this.props.response.createdAt).format('LLL')}</div>
      <JsonViewer obj={this.props.response.body} />
    </div>);
  }
}

PurchaseOrderResponse.propTypes = {
  response: PropTypes.object.isRequired,
};

export default PurchaseOrderResponse;
