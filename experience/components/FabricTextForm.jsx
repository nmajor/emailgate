import React, { PropTypes, Component } from 'react';
import { CirclePicker } from 'react-color';
import FontSelector from './FontSelector';

const colors = [
  '#FFFFFF',
  '#333333',
  '#607d8b',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
];

const fonts = {
  Pacifico: '\'Pacifico\', cursive',
  Ranchers: '\'Ranchers\', cursive',
  'Gloria Hallelujah': '\'Gloria Hallelujah\', cursive',
  Arial: 'Arial, Helvetica, sans-serif',
};


class FabricTextForm extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFontChange = this.handleFontChange.bind(this);

    this.state = {
      text: null,
      font: { name: 'Arial', family: 'Arial, Helvetica, sans-serif' },
      color: '#333',
    };
  }
  handleSubmit() {
    this.props.onSubmit(this.state);
  }
  handleColorChange(data) {
    this.setState({ color: data.hex });
  }
  handleFontChange(data) {
    this.setState({ font: data });
  }
  handleTextChange(evt) {
    this.setState({ text: evt.target.value });
  }
  renderPreview() {
    if (this.state.text) {
      const style = {
        color: this.state.color,
        fontFamily: this.state.font.family,
      };

      return (<div className="form-group text-center">
        <div style={style}>{this.state.text}</div>
      </div>);
    }
  }
  render() {
    return (<div>
      <form>
        {this.renderPreview()}
        <div className="form-group">
          <label>Text</label>
          <input
            type="text"
            className="form-control"
            placeholder="Text"
            onChange={this.handleTextChange}
          />
        </div>
        <div className="form-group">
          <CirclePicker
            color={this.state.color}
            colors={colors}
            onChange={this.handleColorChange}
          />
        </div>
        <div className="form-group">
          <FontSelector
            font={this.state.font}
            fonts={fonts}
            onChange={this.handleFontChange}
          />
        </div>
        <div className="btn btn-danger" onClick={this.props.onClose}>Close</div>
        <div className="btn btn-success" onClick={this.handleSubmit}>Submit</div>
      </form>
    </div>);
  }
}

FabricTextForm.propTypes = {
  obj: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FabricTextForm;
