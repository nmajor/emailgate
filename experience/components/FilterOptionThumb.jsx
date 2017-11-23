import React, { PropTypes, Component } from 'react';
import Filter from '../Filter';

class FilterOptionThumb extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.loadFilter = this.loadFilter.bind(this);
  }
  componentDidMount() {
    this.image = this.img || new Image();
    this.image.onload = this.loadFilter;
    this.image.src = this.props.thumbnailUrl;
  }
  loadFilter() {
    const filter = new Filter(this.image);
    const res = filter.filterImage(this.props.filter);
    const canvas = filter.toCanvas(res);
    $(`.filter-option-thumb-image-${this.props.filter}`).html(canvas); // eslint-disable-line no-undef
  }
  render() {
    return (<div className="filter-option-thumb" onClick={this.props.onClick}>
      <div className={`option-image filter-option-thumb-image-${this.props.filter}`} />
      <div className="option-desc">{this.props.filter}</div>
    </div>);
  }
}

FilterOptionThumb.propTypes = {
  thumbnailUrl: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterOptionThumb;
