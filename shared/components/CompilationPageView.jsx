import React, { PropTypes, Component } from 'react';

class CompilationPageView extends Component {
  componentDidMount() {
    // this.refs.view.scrollIntoView(true);
  }
  renderTemplate() {
    const template = this.props.componentProps.templateFactory(this.props.page);

    if (template && this.props.page.type === 'cover') {
      return <div className="page-cover-container">{template.renderFrontCover()}</div>;
    } else if (template) {
      return <div className="page-container">{template.render()}</div>;
    }
  }
  renderClassName() {
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
