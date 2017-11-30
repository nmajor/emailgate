import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import FabricCanvas from '../components/FabricCanvas';
import _ from 'lodash';

class StampFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleFabricChange = this.handleFabricChange.bind(this);
    this.handleFabricSubmit = this.handleFabricSubmit.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);
  }
  getImageUrl() {
    return _.get(this.props.postcard, 'filteredImage.url') || _.get(this.props.postcard, 'croppedImage.url');
  }
  handleFabricChange(data) {
    this.props.dispatch(Actions.updatePostcardStampData(data));
  }
  handleFabricSubmit(data) {
    this.props.dispatch(Actions.updatePostcardStamppedImage(data));
  }
  render() {
    const imageUrl = this.getImageUrl();
    if (imageUrl) {
      return (<div>
        <FabricCanvas
          backgroundUrl={imageUrl}
          initialData={this.props.postcard.stampData}
          onChange={this.handleFabricChange}
          onSubmit={this.handleFabricSubmit}
        />
      </div>);
    }

    return (<div className="postcard-aspect-wrapper">
      <div className="postcard-aspect-main"></div>
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
