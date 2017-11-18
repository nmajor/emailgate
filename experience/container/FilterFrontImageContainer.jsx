import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
// import * as Actions from '../redux/actions/index';
import { getImageUrl, getRandomImageUrl } from '../helpers';
import ImageCanvas from '../components/ImageCanvas';

class FilterFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.canvasPassback = this.canvasPassback.bind(this);
  }
  canvasPassback(canvas, context) {
    console.log('blah hey there from filter front', canvas, context);
  }
  render() {
    return (<div className="front-filter">
      <div className="preview">
        <ImageCanvas
          imageUrl={getImageUrl(this.props.postcard.image)}
          crop={this.props.postcard.imageCrop}
          passback={this.canvasPassback}
        />
      </div>
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
