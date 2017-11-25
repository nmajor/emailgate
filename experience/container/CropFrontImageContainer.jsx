import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import { getImageUrl } from '../helpers';
import DragCropImageSelector from '../components/DragCropImageSelector';

class CropFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageUrl: null,
    };

    // this.imageWidth = 1200;
    this.imageWidth = 600;
    // this.imageHeight = 800;
    this.imageHeight = 400;

    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  componentWillUnmount() {
    const { croppedImage } = this.props.postcard;
    if (!_.get(croppedImage, 'url')) {
      this.props.dispatch(Actions.cropPostcardImage(this.props.postcard));
    }
  }
  handleNewImage(props) {
    this.props.dispatch(Actions.updatePostcardImage(props));
  }
  handleImageChange(props) {
    this.props.dispatch(Actions.updatePostcardImageCrop(props));
  }
  render() {
    return (<div>
      <DragCropImageSelector
        onNewImage={this.handleNewImage}
        onImageChange={this.handleImageChange}
        url={getImageUrl(this.props.postcard.image)}
        height={this.imageHeight}
        width={this.imageWidth}
        crop={this.props.postcard.imageCrop || {}}
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

CropFrontImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CropFrontImageContainer);
