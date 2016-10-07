import React, { PropTypes, Component } from 'react';

class OrderView extends Component { // eslint-disable-line
  render() {
    return (<div>
      <div></div>
      {JSON.stringify(this.props.order)}
    </div>);
  }
}

OrderView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderView;
