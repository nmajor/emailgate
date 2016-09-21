import React, { PropTypes, Component } from 'react';

class CompilationPageView extends Component {
  componentDidMount() {
    this.refs.view.scrollIntoView(true);
  }
  renderTemplate() {
    const template = this.props.componentProps.templateFactory(this.props.page);

    if (template) {
      return template.render();
    }
  }
  render() {
    return (<div ref="view" className="compilation-page">
      {this.renderTemplate()}
    </div>);
  }
}

CompilationPageView.propTypes = {
  page: PropTypes.object.isRequired,
  componentProps: PropTypes.object,
};

export default CompilationPageView;
