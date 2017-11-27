import React, { PropTypes, Component } from 'react';
import Filter from '../Filter';
import FilterOptionThumb from './FilterOptionThumb';

class FilterImage extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.filters = [
      'original',
      'grayscale',
      'Filter2',
      'Filter1',

      'hue',
      'One',
      'Two',
      'Three',
      'Four',
    ];

    this.applyFilter = this.applyFilter.bind(this);

    this.state = {
      rendering: false,
      imageLoaded: false,
    };

    this.image = this.image || new Image();
    this.image.onload = () => { this.setState({ imageLoaded: true }); };
    this.image.src = this.props.url;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.filterData.filter !== this.props.filterData.filter) {
      this.applyFilter();
    }
  }
  setFilter(filter) {
    this.props.onSubmit({ filter });
  }
  applyFilter() {
    this.setState({ rendering: true });
    const filter = new Filter(this.image);
    const res = filter.filterImage(this.props.filterData.filter);
    const canvas = filter.toCanvas(res);
    $(`#filter-image-${this.props.filterData.filter}`).html(canvas); // eslint-disable-line no-undef
    this.setState({ rendering: false });
  }
  renderFilterOptions() {
    if (this.state.imageLoaded) {
      return this.filters.map((filter, index) => {
        return (<FilterOptionThumb
          key={index}
          filter={filter}
          thumbnailUrl={this.props.thumbnailUrl}
          onClick={() => { this.setFilter(filter); }}
        />);
      });
    }
  }
  renderRendering() {
    if (this.state.rendering) {
      return <div className="rendering">Please wait...</div>;
    }
  }
  renderImage() {
    return (<div className="filter-image" id={`filter-image-${this.props.filterData.filter}`} role="presentation">
      <img role="presentation" src={this.props.url} />
    </div>);
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
  filterData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FilterImage;
