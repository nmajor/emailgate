import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class PreviewCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (!this.props.currentEmail.pdf) {
      this.props.dispatch(Actions.getCompilationEmailPdf(this.props.compilation._id, this.props.currentEmail));
    }
  }
  renderPdf() {
    if (this.props.currentEmail.fetchingPdf) {
      return <div>Loading ...</div>;
    } else if (this.props.currentEmail.pdf) {
      return <object className="pdf" data={`${this.props.currentEmail.pdf}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
    }
  }
  renderPreview() {
    if (this.props.currentEmail) {
      return (
        <div className="compilation-email-preview">
          <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} currentPage="preview" />
          {this.renderPdf()}
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

PreviewCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(PreviewCompilationEmailsContainer);
