import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import CropFrontImageContainer from './CropFrontImageContainer';
import FilterFrontImageContainer from './FilterFrontImageContainer';
import StampFrontImageContainer from './StampFrontImageContainer';

class BuildPostcardBackContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageUrl: null,
      step: 'crop',
    };
  }
  renderOption(text, step) {
    const selected = step === this.state.step;
    return (<div
      className={`option ${selected ? 'active' : ''}`}
      onClick={() => { this.setState({ step }); }}
    >
      {text}
    </div>);
  }
  renderFrontOptions() {
    return (<div className="postcard-front-options">
      {this.renderOption('Crop', 'crop')}
      {this.renderOption('Filter', 'filter')}
      {this.renderOption('Customize', 'customize')}
    </div>);
  }
  renderCurrentOption() {
    switch (this.state.step) {
      case 'crop':
        return (<CropFrontImageContainer />);
      case 'filter':
        return <FilterFrontImageContainer />;
      case 'customize':
        return <StampFrontImageContainer />;
      default:
        return null;
    }
  }
  render() {
    return (<div>
      {this.renderCurrentOption()}
      {this.renderFrontOptions()}
    </div>);
  }
}

function mapStateToProps(store) {
  const { postcard } = store;
  return {
    postcard,
  };
}

BuildPostcardBackContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BuildPostcardBackContainer);
