import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationPagesListContainer from './CompilationPagesListContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationPagesContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationPages.length < 1) {
      this.props.dispatch(Actions.getCompilationPages(this.props.params.compilationId));
    }

    this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
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
      <div className="edit-account-container">
        <Header />
        <CompilationNav compilationId={this.props.params.compilationId} currentPage="pages" />
        <div className="container">
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
      </div>
    );
  }
}

CompilationPagesContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationPages.bind(null, params.compilationId, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    compilationPages: store.compilationPages,
  };
}

CompilationPagesContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPagesContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilations: PropTypes.array,
  compilationPages: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPagesContainer);
