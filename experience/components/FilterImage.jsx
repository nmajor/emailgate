// https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
// https://github.com/kig/canvasfilters
// http://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/

// https://stackoverflow.com/questions/726549/algorithm-for-additive-color-mixing-for-rgb-values
// http://mashable.com/2013/10/20/photoshop-instagram-filters/#m9VYuCVBmPq3
// http://photodoto.com/instagram-filters-tutorial-amaro-mayfair/

import React, { PropTypes, Component } from 'react';
import Filter from '../Filter';

class FilterImage extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.filters = [
      'original',
      'convolute',
      'grayscale',
      'brightness',
      'contrast',
      'overlayColor',
    ];

    this.applyFilter = this.applyFilter.bind(this);

    this.image = this.img || new Image();
    // this.image.onload = () => { this.drawCanvas(this.img); };
    this.image.src = this.props.url;

    this.state = {
      imageUrl: props.url,
      filter: null,
      rendering: false,
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter) {
      this.applyFilter();
    }
  }
  applyFilter() {
    this.setState({ rendering: true });
    const filter = new Filter(this.image);
    const res = filter.filterImage(this.state.filter);
    const canvas = filter.toCanvas(res);
    $(`#filter-image-${this.state.filter}`).html(canvas); // eslint-disable-line no-undef
    this.setState({ rendering: false });
  }
  renderFilterOptions() {
    return this.filters.map((filter, index) => {
      return (<div key={index} onClick={() => { this.setState({ filter }); }}>{filter}</div>);
    });
  }
  renderRendering() {
    if (this.state.rendering) {
      return <div className="rendering">Please wait...</div>;
    }
  }
  renderImage() {
    if (this.state.filter) {
      return (<div id={`filter-image-${this.state.filter}`} role="presentation" />);
    }

    return (<img role="presentation" src={this.props.url} />);
  }
  render() {
    return (<div className="filter-image-wrapper">
      <div className="image">
        {this.renderRendering()}
        {this.renderImage()}
      </div>
      <div className="options">
        {this.renderFilterOptions()}
      </div>
    </div>);
  }
}

FilterImage.propTypes = {
  url: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FilterImage;
