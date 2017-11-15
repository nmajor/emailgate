import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import DragCropImageSelector from '../components/DragCropImageSelector';

class BuildPostcardBackContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    const rangeMin = 1;
    const rangeMax = 400;
    const randomImageId = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    this.randomImageUrl = `https://source.unsplash.com/collection/140375/${randomImageId}`;

    this.state = {
      imageUrl: null,
    };

    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  getImageUrl() {
    const postcardImage = this.props.postcard.image || {};
    if (postcardImage.content) {
      return `data:${postcardImage.contentType};base64,${postcardImage.content}`;
    }

    return this.randomImageUrl;
  }
  handleNewImage(props) {
    this.props.dispatch(Actions.setPostcardProps({ image: props }));
  }
  handleImageChange(props) {
    this.props.dispatch(Actions.setPostcardProps({ imageCrop: props }));
  }
  render() {
    console.log('blah hey 1', this.props.postcard);
    // const { compilation } = this.props;
    return (<DragCropImageSelector
      onNewImage={this.handleNewImage}
      onImageChange={this.handleImageChange}
      url={this.getImageUrl()}
      height={400}
      width={600}
    />);

    // return (<div className="postcard-back postcard-aspect-wrapper">
    //   <div className="postcard-aspect-main">
    //
    //   </div>
    // </div>);
  }
}

function mapStateToProps(store) {
  return {
    postcard: store.postcard,
  };
}

BuildPostcardBackContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

BuildPostcardBackContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BuildPostcardBackContainer);
