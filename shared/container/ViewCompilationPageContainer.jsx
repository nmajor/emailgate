import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPageNavContainer from './CompilationPageNavContainer';

class ViewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="view" />
        <h3>View Compilation Page</h3>
      </div>
    );
  }
}

ViewCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
};

export default connect()(ViewCompilationPageContainer);
