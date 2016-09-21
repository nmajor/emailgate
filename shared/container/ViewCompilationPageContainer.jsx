import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';

class ViewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.params.pageId) {
      this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId) {
      this.currentPage = _.find(nextProps.compilationPages, { _id: nextProps.params.pageId });
    }
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentPage={this.currentPage} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
  };
}

ViewCompilationPageContainer.propTypes = {
  compilationPages: PropTypes.array.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationPageContainer);
