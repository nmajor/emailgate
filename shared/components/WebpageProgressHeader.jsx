import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class WebpageProgressHeader extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.stepPaths = [
      'build',
      'preview',
      'share',
    ];
  }
  getPrevStep() {
    const currentIndex = this.stepPaths.indexOf(this.props.currentPath);
    const prevStep = this.stepPaths[currentIndex - 1];
    return prevStep;
  }
  getNextStep() {
    const currentIndex = this.stepPaths.indexOf(this.props.currentPath);
    const nextStep = this.stepPaths[currentIndex + 1];
    return nextStep;
  }
  renderStepItem(path, text, icon) {
    let body = text;
    let itemClass = 'item';
    let itemIcon = '';

    if (icon) {
      itemIcon = <Link className="icon" to={`/compilations/${this.props.compilation._id}/webpage/${path}`}><span className={`glyphicon glyphicon-${icon}`} aria-hidden="true"></span></Link>;
    }

    if (path === this.props.currentPath) {
      itemClass += ' active';
    }

    return (<div className={itemClass}>
      {itemIcon}
      <div><Link className="text" to={`/compilations/${this.props.compilation._id}/webpage/${path}`}>{body}</Link></div>
    </div>);
  }
  renderNextAction() {
    const nextStep = this.getNextStep();
    if (nextStep) {
      return (<div className="item">
        <Link className="nav-icon" to={`/compilations/${this.props.compilation._id}/webpage/${nextStep}`}>
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        </Link>
        <div><Link className="text" to={`/compilations/${this.props.compilation._id}/webpage/${nextStep}`}>Next</Link></div>
      </div>);
    }

    return (<div className="item disabled">
      <span className="nav-icon">
        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      </span>
      <div><span className="text">Next</span></div>
    </div>);
  }
  renderPrevAction() {
    const prevStep = this.getPrevStep();
    if (prevStep) {
      return (<div className="item">
        <Link className="nav-icon" to={`/compilations/${this.props.compilation._id}/webpage/${prevStep}`}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></Link>
        <div><Link className="text" to={`/compilations/${this.props.compilation._id}/webpage/${prevStep}`}>Back</Link></div>
      </div>);
    }

    return (<div className="item disabled">
      <span className="nav-icon"><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></span>
      <div><span className="text">Back</span></div>
    </div>);
  }
  render() {
    return (<div className="progress-header webpage">
      <div className="container">
        <div className="row">
          {this.renderPrevAction()}
          <div className="wizard">
            {this.renderStepItem('build', 'Edit', 'pencil')}
            {this.renderStepItem('preview', 'Preview', 'eye-open')}
            {this.renderStepItem('share', 'Share', 'share')}
            <div className="spacer" />
          </div>
          {this.renderNextAction()}
        </div>
      </div>
    </div>);
  }
}

WebpageProgressHeader.propTypes = {
  compilation: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default WebpageProgressHeader;
