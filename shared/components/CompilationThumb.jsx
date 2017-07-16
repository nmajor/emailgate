import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class CompilationThumb extends Component {
  renderThumbImage() {
    const { compilation } = this.props;

    if (_.get(compilation, 'thumbnail.url')) {
      return (<img role="presentation" src={compilation.thumbnail.url} />);
    }

    return <img role="presentation" className="img-responsive" src="/img/cover-thumbs/thumbnail-placeholder.png" />;
  }
  render() {
    return this.renderThumbImage();
  }
}

CompilationThumb.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationThumb;
