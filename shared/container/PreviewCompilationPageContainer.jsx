import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPagePdf from '../components/CompilationPagePdf';
import CompilationPageNavContainer from './CompilationPageNavContainer';
// import * as Actions from '../redux/actions/index';

class PreviewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
        <CompilationPagePdf page={this.props.currentPage} />
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
