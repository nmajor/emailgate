import React, { PropTypes, Component } from 'react';

class CompilationPageView extends Component {
  renderTemplate() {
    if (this.props.template) {
      return this.props.template.render();
    }
  }
  render() {
    return (
      <div>
        <h3>{this.props.page.desc}</h3>
        <div className="compilation-page">
          {this.renderTemplate()}
        </div>
      </div>
    );
  }
}

CompilationPageView.propTypes = {
  compilation: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  template: PropTypes.object,
};

export default CompilationPageView;
