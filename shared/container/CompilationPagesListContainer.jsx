import React, { PropTypes, Component } from 'react';
import CompilationPagesList from '../components/CompilationPagesList';
import { connect } from 'react-redux';

class CompilationPagesListContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <CompilationPagesList
        pages={this.props.compilationPages}
        currentPageId={this.props.currentPageId}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
  };
}

CompilationPagesListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array,
  currentPageId: PropTypes.string,
};

export default connect(mapStateToProps)(CompilationPagesListContainer);
