import React, { PropTypes, Component } from 'react';
import Filter from '../Filter';
import FilterOptionThumb from './FilterOptionThumb';

class FilterImage extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.filters = [
      'original',
      'grayscale',
      'Filter1',
      'Filter2',

      'hue',
      'One',
      'Two',
      'Three',
      'Four',
    ];

    this.applyFilter = this.applyFilter.bind(this);

    this.state = {
      filter: 'original',
      rendering: false,
      imageLoaded: false,
    };

    this.image = this.image || new Image();
    this.image.onload = () => { this.setState({ imageLoaded: true }); };
    this.image.src = this.props.url;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter) {
      this.applyFilter();
    }
  }
  componentWillUnmount() {
    const filter = new Filter(this.image);
    const res = filter.filterImage(this.state.filter);
    const url = filter.toDataURL(res);
    this.props.onSubmit(url);
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
    if (this.state.imageLoaded) {
      return this.filters.map((filter, index) => {
        return (<FilterOptionThumb
          key={index}
          filter={filter}
          thumbnailUrl={this.props.thumbnailUrl}
          onClick={() => { this.setState({ filter }); }}
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
    return (<div id={`filter-image-${this.state.filter}`} role="presentation">
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
  onSubmit: PropTypes.func.isRequired,
};

export default FilterImage;
