import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import BuildPostcardContainer from './BuildPostcardContainer';

class PostcardWebpageContainer extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderImage() {
    const { compilation } = this.props;
    const image = compilation.webpage.image || {};
    const crop = compilation.webpage.imageCrop || {};

    // const resize = 0.6;
    const resize = 0.5;

    return (<div
      className="profile-image-cropp-wrapper"
      style={{
        width: `${crop.w * resize}px`,
        height: `${crop.h * resize}px`,
        overflow: 'hidden',
      }}
    >
      <img
        style={{
          position: 'relative',
          top: `-${crop.y * resize}px`,
          left: `-${crop.x * resize}px`,
          width: `${crop.naturalWidth * crop.scale * resize}px`,
        }} role="presentation" src={image.url}
      />
    </div>);
  }
  render() {
    const { compilation } = this.props;

    return (<div className="profile-page-container">
      <div className="container-fluid profile-container">
        <div className="banner-body">
          <div className="row">
            <div className="col-md-12 centered">
              <div className="profile-box">
                {this.renderImage()}
                <h3>{compilation.webpage.title}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    compilation: store.compilation,
  };
}

PostcardWebpageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

PostcardWebpageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PostcardWebpageContainer);
