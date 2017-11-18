import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import DragCropImageSelector from '../components/DragCropImageSelector';
import FilterFrontImageContainer from './FilterFrontImageContainer';
import { getImageUrl, getRandomImageUrl } from '../helpers';

class BuildPostcardBackContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageUrl: null,
      step: 'crop',
    };

    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  handleNewImage(props) {
    this.props.dispatch(Actions.setPostcardProps({ image: props }));
  }
  handleImageChange(props) {
    this.props.dispatch(Actions.setPostcardProps({ imageCrop: props }));
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
        return (<DragCropImageSelector
          onNewImage={this.handleNewImage}
          onImageChange={this.handleImageChange}
          url={getImageUrl(this.props.postcard.image)}
          height={400}
          width={600}
          crop={this.props.postcard.imageCrop || {}}
        />);
      case 'filter':
        return <FilterFrontImageContainer />;
      case 'customize':
        return <div>customize</div>;
      default:
        return null;
    }
  }
  render() {
    // const { compilation } = this.props;
    return (<div>
      {this.renderCurrentOption()}
      {this.renderFrontOptions()}
    </div>);

    // return (<div className="postcard-back postcard-aspect-wrapper">
    //   <div className="postcard-aspect-main">
    //
    //   </div>
    // </div>);
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

BuildPostcardBackContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BuildPostcardBackContainer);
