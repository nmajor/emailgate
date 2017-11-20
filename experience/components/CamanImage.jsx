// https://www.html5rocks.com/en/tutorials/canvas/imagefilters/

import React, { PropTypes, Component } from 'react';

class CamanImage extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.camanFilters = [
      'vintage',
      'lomo',
      'clarity',
      'sinCity',
      'sunrise',
      'crossProcess',
      'orangePeel',
    ];

    this.applyFilter = this.applyFilter.bind(this);

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
    const component = this;
    this.setState({ rendering: true });
    Caman(`#caman-image-${this.state.filter}`, function () { // eslint-disable-line
      this[component.state.filter]();
      this.render(() => {
        component.setState({
          rendering: false,
          imageUrl: $('#caman-image').attr('src'), // eslint-disable-line no-undef
        });
      });
    });
  }
  renderFilterOptions() {
    return this.camanFilters.map((filter, index) => {
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
      return (<img id={`caman-image-${this.state.filter}`} role="presentation" src={this.props.url} />);
    }

    return (<img role="presentation" src={this.props.url} />);
  }
  render() {
    return (<div className="caman-wrapper">
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

CamanImage.propTypes = {
  url: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CamanImage;
