import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class FontSelector extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderOption(name, family) {
    const style = {
      fontFamily: family,
    };

    return (<div
      key={name}
      className="font-thing"
      style={style}
      onClick={() => { this.props.onChange({ name, family }); }}
    >
      {name}
    </div>);
  }
  renderOptions() {
    return _.map(this.props.fonts, (family, name) => {
      return this.renderOption(name, family);
    });
  }
  render() {
    return (<div>
      {this.renderOptions()}
    </div>);
  }
}

FontSelector.propTypes = {
  font: PropTypes.object.isRequired,
  fonts: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FontSelector;
