import React, { PropTypes, Component } from 'react';
import { pageMeta } from '../helpers';

class CompilationPageView extends Component {
  renderTemplate() {
    if (this.props.template) {
      return this.props.template.render();
    }
  }
  render() {
    console.log(this.props.page);
    return (
      <div>
        <h3>{pageMeta(this.props.page).desc}</h3>
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
