import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import CompilationEmailPdf from '../components/CompilationEmailPdf';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class PreviewCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  renderPreview() {
    if (this.props.currentEmail) {
      return (
        <div className="compilation-email-preview">
          <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} active="preview" />
          <CompilationEmailPdf email={this.props.currentEmail} />
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

PreviewCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(PreviewCompilationEmailContainer);
