import React, { PropTypes, Component } from 'react';

class ScreencastHelper extends Component { // eslint-disable-line
  //
  constructor(props, context) {
    super(props, context);
    this.videoId = this.getVideoIdFromYoutubeUrl(props.videoUrl);
  }
  getVideoIdFromYoutubeUrl(videoUrl) {
    const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&\?]*).*/;
    return videoUrl.match(regex)[1];
  }
  // renderVideoThumbnailUrl() {
  //   return `https://img.youtube.com/vi/${this.videoId}/hqdefault.jpg`;
  // }
  render() {
    if (this.props.visible) {
      return (<div className="screencast-helper content-box bottom-bumper relative">
        <div className="show-hide">
          <div className="btn-link" onClick={this.props.hide}>Hide Help</div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div>{this.props.children}</div>
          </div>
          <div className="col-sm-6">
            <div className="screencast-thumb-wrapper">
              <div className="videowrapper">
                <iframe width="560" height="315" src={`https://www.youtube.com/embed/${this.videoId}?rel=0`} frameBorder="0" allowFullScreen="" />
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix" />
        <div className="footer hidden-xs hidden-sm">
          <div className="btn btn-default" onClick={this.props.hide}>Hide This Help Box</div>
        </div>
      </div>);
    }

    return (<div className="screencast-helper-actions">
      <div className="btn-link" onClick={this.props.show}>Need some help for this page? Click here for a video tutorial!</div>
    </div>);
  }
}

ScreencastHelper.propTypes = {
  children: PropTypes.array,
  videoUrl: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  show: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ScreencastHelper;
