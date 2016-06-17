import React, { PropTypes, Component } from 'react';
// import { pageMeta } from '../helpers';

class CompilationPageView extends Component {
  renderTemplate() {
    if (this.props.template) {
      return this.props.template.render();
    }
  }
  render() {
    return (<div className="compilation-page">
      {this.renderTemplate()}
    </div>);
  }
}

CompilationPageView.propTypes = {
  compilation: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  template: PropTypes.object,
};

export default CompilationPageView;
