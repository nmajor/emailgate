import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
// import * as Actions from '../redux/actions/index';
import FabricCanvas from '../components/FabricCanvas';

class StampFrontImageContainer extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    return (<div>
      <FabricCanvas
        backgroundUrl={this.props.postcard.croppedImage.url}
        onSubmit={() => {}}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  const { postcard } = store;
  return {
    postcard,
  };
}

StampFrontImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(StampFrontImageContainer);
