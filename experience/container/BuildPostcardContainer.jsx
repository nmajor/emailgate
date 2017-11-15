import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import BuildPostcardBackContainer from './BuildPostcardBackContainer';
import BuildPostcardFrontContainer from './BuildPostcardFrontContainer';

class BuildPostcardContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      // step: 'front',
      step: 'back',
    };
  }
  renderStep(text, step) {
    const selected = step === this.state.step;
    return (<div
      className={`step ${selected ? 'active' : ''}`}
      onClick={() => { this.setState({ step }); }}
    >
      {text}
    </div>);
  }
  renderStepOptions() {
    return (<div className="build-postcard-steps">
      {this.renderStep('Front', 'front')}
      {this.renderStep('Back', 'back')}
      {this.renderStep('Send', 'send')}
    </div>);
  }
  renderCurrentStepContainer() {
    switch (this.state.step) {
      case 'back':
        return <BuildPostcardBackContainer />;
      case 'front':
        return <BuildPostcardFrontContainer />;
      case 'send':
        return <div></div>;
      default:
        return null;
    }
  }
  render() {
    return (<div className="">
      {this.renderStepOptions()}
      {this.renderCurrentStepContainer()}
    </div>);
  }
}

BuildPostcardContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

BuildPostcardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(BuildPostcardContainer);
