import React, { PropTypes, Component } from 'react';
import JSONTree from 'react-json-tree';

class JsonViewer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.theme = {
      scheme: 'embers',
      base00: '#16130F',
      base01: '#2C2620',
      base02: '#433B32',
      base03: '#5A5047',
      base04: '#8A8075',
      base05: '#A39A90',
      base06: '#BEB6AE',
      base07: '#DBD6D1',
      base08: '#826D57',
      base09: '#828257',
      base0A: '#6D8257',
      base0B: '#57826D',
      base0C: '#576D82',
      base0D: '#6D5782',
      base0E: '#82576D',
      base0F: '#825757',
    };
  }
  renderTree() {
    if (this.props.obj) {
      return (<JSONTree
        theme={this.theme}
        data={this.props.obj}
      />);
    }
  }
  render() {
    return <div>{this.renderTree()}</div>;
  }
}

JsonViewer.propTypes = {
  obj: PropTypes.object.isRequired,
};

export default JsonViewer;
