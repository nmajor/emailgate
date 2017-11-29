import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import FabricCanvas from '../components/FabricCanvas';

class StampFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleFabricChange = this.handleFabricChange.bind(this);
    this.handleFabricSubmit = this.handleFabricSubmit.bind(this);
  }
  handleFabricChange(data) {
    this.props.dispatch(Actions.updatePostcardStampData(data));
    console.log('blah changing', data);
  }
  handleFabricSubmit(data) {
    console.log('blah submit', data.substring(0, 100));
  }
  render() {
    return (<div>
      <FabricCanvas
        backgroundUrl={this.props.postcard.croppedImage.url}
        initialData={this.props.postcard.stampData}
        onChange={this.handleFabricChange}
        onSubmit={this.handleFabricSubmit}
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
