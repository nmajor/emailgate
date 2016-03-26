import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPageNavContainer from './CompilationPageNavContainer';

class PreviewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
        <h3>Preview Compilation Page</h3>
      </div>
    );
  }
}

PreviewCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
};

export default connect()(PreviewCompilationPageContainer);
