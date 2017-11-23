import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import { rotateImage, getRandomImageUrl, cropImage } from '../helpers';
import FilterImage from '../components/FilterImage';
import _ from 'lodash';

class FilterFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageUrl: null,
    };

    this.loadImageUrl = this.loadImageUrl.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
  }
  componentDidMount() {
    const { imageCrop, croppedImage } = this.props.postcard;
    if (!_.get(croppedImage, 'url') || imageCrop.updatedAt > croppedImage.updatedAt) {
      this.props.dispatch(Actions.cropPostcardImage(this.props.postcard));
    } else {
      this.loadImageUrl();
    }
  }
  componentWillReceiveProps(nextProps) {
    const croppedImageUrl = _.get(this.props.postcard, 'croppedImage.url');
    const nextCroppedImageUrl = _.get(nextProps.postcard, 'croppedImage.url');
    if (nextCroppedImageUrl && croppedImageUrl !== nextCroppedImageUrl) {
      this.loadImageUrl(nextCroppedImageUrl);
    }
  }
  loadImageUrl(url) {
    const imageUrl = url || _.get(this.props.postcard, 'croppedImage.url');
    if (imageUrl) {
      this.setState({ imageUrl });
    }
  }
  handleImageSubmit(data) {
    console.log('blah handleImageSubmit', data);
  }
  render() {
    if (this.state.imageUrl) {
      return (
        <FilterImage
          url={this.state.imageUrl}
          onSubmit={this.handleImageSubmit}
        />
      );
    }

    return <div></div>;
  }
}

function mapStateToProps(store) {
  const { postcard } = store;
  if (!postcard.image) {
    postcard.image = { url: getRandomImageUrl() };
  }

  return {
    postcard,
  };
}

FilterFrontImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FilterFrontImageContainer);
