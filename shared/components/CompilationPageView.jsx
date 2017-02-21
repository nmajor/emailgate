import React, { PropTypes, Component } from 'react';

class CompilationPageView extends Component {
  componentDidMount() {
    this.refs.view.scrollIntoView(true);
  }
  renderTemplate() {
    const template = this.props.componentProps.templateFactory(this.props.page);

    if (template && this.props.page.type === 'cover') {
      return template.renderFrontCover();
    } else if (template) {
      return template.render();
    }
  }
  renderClassName() {
    if (this.props.page.type === 'cover') { return null; }

    return 'compilation-page';
  }
  render() {
    return (<div ref="view" className={this.renderClassName()}>
      {this.renderTemplate()}
    </div>);
  }
}

CompilationPageView.propTypes = {
  page: PropTypes.object.isRequired,
  componentProps: PropTypes.object,
};

export default CompilationPageView;
