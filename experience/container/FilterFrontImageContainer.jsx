import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import { getImageUrl, getRandomImageUrl, cropImage } from '../helpers';
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
    const { imageCrop, scaledImage } = this.props.postcard;
    if (!_.get(scaledImage, 'url') || imageCrop.updatedAt > scaledImage.updatedAt) {
      this.props.dispatch(Actions.scalePostcardImage(this.props.postcard));
    } else {
      this.loadImageUrl();
    }
  }
  componentWillReceiveProps(nextProps) {
    const scaledImageUrl = _.get(this.props.postcard, 'scaledImage.url');
    const nextScaledImageUrl = _.get(nextProps.postcard, 'scaledImage.url');
    if (nextScaledImageUrl && scaledImageUrl !== nextScaledImageUrl) {
      this.loadImageUrl(nextScaledImageUrl);
    }
  }
  loadImageUrl(url) {
    const scaledImageUrl = url || _.get(this.props.postcard, 'scaledImage.url');
    if (scaledImageUrl) {
      cropImage(scaledImageUrl, this.props.postcard.imageCrop)
      .then((croppedUrl) => {
        this.setState({ imageUrl: croppedUrl });
      });
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
