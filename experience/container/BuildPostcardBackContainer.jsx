import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class BuildPostcardFrontContainer extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    // const { compilation } = this.props;

    return (<div className="postcard-back postcard-aspect-wrapper">
      <div className="postcard-aspect-main">
        Back
      </div>
    </div>);
  }
}

BuildPostcardFrontContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

BuildPostcardFrontContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(BuildPostcardFrontContainer);
