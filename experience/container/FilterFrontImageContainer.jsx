import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
// import * as Actions from '../redux/actions/index';
import { getImageUrl, getRandomImageUrl, cropImage } from '../helpers';
import FilterImage from '../components/FilterImage';

class FilterFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageUrl: null,
    };

    this.handleImageSubmit = this.handleImageSubmit.bind(this);
  }
  componentDidMount() {
    cropImage(getImageUrl(this.props.postcard.image), this.props.postcard.imageCrop)
    .then((url) => {
      this.setState({ imageUrl: url });
    });
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
