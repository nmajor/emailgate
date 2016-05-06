import React, { PropTypes, Component } from 'react';
import CompilationBuildContainer from './CompilationBuildContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationPagesContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentPage = _.find(nextProps.compilationPages, { _id: nextProps.params.pageId });
  }

  render() {
    return (<CompilationBuildContainer currentPage={this.currentPage} compilation={this.props.compilation} >
      {this.props.children}
    </CompilationBuildContainer>);
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
  };
}

CompilationPagesContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPagesContainer.propTypes = {
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPagesContainer);
