import React, { PropTypes, Component } from 'react';
import CompilationPageNav from '../components/CompilationPageNav';
import { connect } from 'react-redux';

class CompilationPageNavContainer extends Component { // eslint-disable-line
  render() {
    return <CompilationPageNav page={this.props.currentPage} active={this.props.active} />;
  }
}

CompilationPageNavContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
};

export default connect()(CompilationPageNavContainer);
