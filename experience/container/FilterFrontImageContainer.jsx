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

    this.handleImageSubmit = this.handleImageSubmit.bind(this);
  }
  componentDidMount() {
    const { croppedImage } = this.props.postcard;
    if (!_.get(croppedImage, 'url')) {
      this.props.dispatch(Actions.cropPostcardImage(this.props.postcard));
    }
  }
  handleImageSubmit(data) {
    console.log('blah handleImageSubmit', data);
  }
  render() {
    if (_.get(this.props.postcard, 'croppedImage.url')) {
      return (<div>
        <FilterImage
          url={this.props.postcard.croppedImage.url}
          thumbnailUrl={this.props.postcard.thumbnail.url}
          onSubmit={this.handleImageSubmit}
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
