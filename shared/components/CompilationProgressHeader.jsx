import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationProgressHeader extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.stepPaths = [
      'title',
      'add-emails',
      'build',
      'checkout',
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
      itemIcon = <Link className="icon" to={`/compilations/${this.props.compilation._id}/${path}`}><span className={`glyphicon glyphicon-${icon}`} aria-hidden="true"></span></Link>;
    }

    if (path === this.props.currentPath) {
      itemClass += ' active';
    }

    return (<div className={itemClass}>
      {itemIcon}
      <div><Link className="text" to={`/compilations/${this.props.compilation._id}/${path}`}>{body}</Link></div>
    </div>);
  }
  renderNextAction() {
    const nextStep = this.getNextStep();
    if (nextStep) {
      return (<div className="item">
        <Link className="nav-icon" to={`/compilations/${this.props.compilation._id}/${nextStep}`}>
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        </Link>
        <div><Link className="text" to={`/compilations/${this.props.compilation._id}/${nextStep}`}>Next</Link></div>
      </div>);
    }

    return <span className="action-spacer"></span>;
  }
  renderPrevAction() {
    const prevStep = this.getPrevStep();
    if (prevStep) {
      return (<div className="item">
        <Link className="nav-icon" to={`/compilations/${this.props.compilation._id}/${prevStep}`}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></Link>
        <div><Link className="text" to={`/compilations/${this.props.compilation._id}/${prevStep}`}>Back</Link></div>
      </div>);
    }

    return <span className="action-spacer"></span>;
  }
  render() {
    return (<div className="progress-header">
      <div className="container">
        <div className="row">
          {this.renderPrevAction()}
          <div className="wizard">
            {this.renderStepItem('title', 'Design Cover', 'book')}
            {this.renderStepItem('add-emails', 'Add Emails', 'envelope')}
            {this.renderStepItem('build', 'Edit', 'pencil')}
            {this.renderStepItem('checkout', 'Checkout', 'shopping-cart')}
            <div className="spacer" />
          </div>
          {this.renderNextAction()}
        </div>
      </div>
    </div>);
  }
}

CompilationProgressHeader.propTypes = {
  compilation: PropTypes.object.isRequired,
  currentPath: PropTypes.string.isRequired,
};

export default CompilationProgressHeader;
