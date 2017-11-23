import React, { PropTypes, Component } from 'react';
import Filter from '../Filter';
import FilterOptionThumb from './FilterOptionThumb';

class FilterImage extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.filters = [
      'original',
      'grayscale',
      'Four',

      'convolute',
      'brightness',
      'contrast',
      'overlayColor',
      'One',
      'Two',
      'Three',
      'vignette',
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
      return (<FilterOptionThumb
        key={index}
        filter={filter}
        thumbnailUrl={this.props.thumbnailUrl}
        onClick={() => { this.setState({ filter }); }}
      />);
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
  thumbnailUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FilterImage;
