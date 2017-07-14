import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class CompilationThumb extends Component {
  renderThumbImage() {
    const { compilation } = this.props;

    if (_.get(compilation, 'thumbnail.content')) {
      const dataUriPrefix = `data:${compilation.thumbnail.contentType};base64,`;

      return (<img role="presentation" src={dataUriPrefix + compilation.thumbnail.content} />);
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
