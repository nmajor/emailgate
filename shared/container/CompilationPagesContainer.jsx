import React, { PropTypes, Component } from 'react';
import CompilationPagesListContainer from './CompilationPagesListContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationPagesContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;

    this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentPage = _.find(nextProps.compilationPages, { _id: nextProps.params.pageId });
  }
  renderChildren() {
    if (this.props.children) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation, currentPage: this.currentPage });
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Custom Pages</h1>
        <div className="row">
          <div className="col-md-3">
            <CompilationPagesListContainer compilation={this.compilation} currentPageId={this.props.params.pageId} />
          </div>
          <div className="col-md-9">
            { this.renderChildren() }
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
    compilationEmailPageMap: store.compilationEmailPageMap,
  };
}

CompilationPagesContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPagesContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array,
  compilationEmailPageMap: PropTypes.object,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPagesContainer);
