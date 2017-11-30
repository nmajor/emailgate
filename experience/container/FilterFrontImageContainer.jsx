import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import Script from 'react-load-script';
import * as Actions from '../redux/actions/index';
import FilterImage from '../components/FilterImage';
import _ from 'lodash';

class FilterFrontImageContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
  }
  handleImageChange(data) {
    this.props.dispatch(Actions.updatePostcardFilterData(data));
  }
  handleImageSubmit(data) {
    this.props.dispatch(Actions.updatePostcardFilteredImage(data));
  }
  render() {
    if (_.get(this.props.postcard, 'croppedImage.url')) {
      return (<div>
        <FilterImage
          url={this.props.postcard.croppedImage.url}
          thumbnailUrl={this.props.postcard.thumbnail.url}
          filterData={this.props.postcard.filterData || {}}
          onChange={this.handleImageChange}
          onSubmit={this.handleImageSubmit}
        />
      </div>);
    }

    return (<div className="postcard-aspect-wrapper">
      <div className="postcard-aspect-main"></div>
    </div>);
  }
}

function mapStateToProps(store) {
  const { postcard } = store;

  return {
    postcard,
  };
}

FilterFrontImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FilterFrontImageContainer);
