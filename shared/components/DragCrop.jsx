import React, { Component, PropTypes } from 'react';
import Script from 'react-load-script';

class DragCrop extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleJqueryLoad = this.handleJqueryLoad.bind(this);
    this.handleGuillotineLoad = this.handleGuillotineLoad.bind(this);
    this.handleGuillotineDrop = this.handleGuillotineDrop.bind(this);
    this.handleRotateLeftClick = this.handleRotateLeftClick.bind(this);
    this.handleRotateRightClick = this.handleRotateRightClick.bind(this);
    this.handleRotateZoomInClick = this.handleRotateZoomInClick.bind(this);
    this.handleRotateZoomOutClick = this.handleRotateZoomOutClick.bind(this);
    this.handleFitClick = this.handleFitClick.bind(this);

    this.state = {
      loadJquery: false,
      loadGuillotine: false,
      picture: null,
    };
  }
  componentDidMount() {
    this.setState({ loadJquery: true }); // eslint-disable-line
  }
  handleGuillotineDrop(data) {
    this.props.onImageChange(data);
  }
  handleJqueryLoad() {
    this.setState({ loadGuillotine: true });
  }
  handleGuillotineLoad() {
    const picture = $('#gui-picture'); // eslint-disable-line
    picture.guillotine({
      width: this.props.width,
      height: this.props.height,
      onChange: this.handleGuillotineDrop,
    });
    this.setState({ picture });
  }
  handleRotateLeftClick() {
    this.state.picture.guillotine('rotateLeft');
  }
  handleRotateRightClick() {
    this.state.picture.guillotine('rotateRight');
  }
  handleRotateZoomInClick() {
    this.state.picture.guillotine('zoomIn');
  }
  handleRotateZoomOutClick() {
    this.state.picture.guillotine('zoomOut');
  }
  handleFitClick() {
    this.state.picture.guillotine('fit');
  }
  renderJqueryScript() {
    if (this.state.loadJquery) {
      return (<Script
        url="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"
        onLoad={this.handleJqueryLoad}
      />);
    }
  }
  renderGuillotineScript() {
    if (this.state.loadGuillotine) {
      return (<Script
        url="/js/jquery.guillotine.min.js"
        onLoad={this.handleGuillotineLoad}
      />);
    }
  }
  renderControl(icon, handler) {
    return (<span className="control" onClick={handler}><span className={`glyphicon glyphicon-${icon}`} aria-hidden="true"></span></span>);
  }
  render() {
    return (
      <div className="gui-wrapper" style={{ width: `${this.props.width}px` }}>
        {this.renderJqueryScript()}
        {this.renderGuillotineScript()}
        <div className="gui-parent" style={{ height: `${this.props.height}px`, width: `${this.props.width}px` }}>
          <img role="presentation" id="gui-picture" src={this.props.url} />
        </div>
        <div className="gui-controls" style={{ width: `${this.props.width}px` }}>
          {this.renderControl('zoom-in', this.handleRotateZoomInClick)}
          {this.renderControl('zoom-out', this.handleRotateZoomOutClick)}
          {this.renderControl('resize-full', this.handleFitClick)}
          {this.renderControl('repeat', this.handleRotateRightClick)}
        </div>
      </div>
    );
  }
}

DragCrop.propTypes = {
  url: PropTypes.string,
  onImageChange: PropTypes.func,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default DragCrop;
