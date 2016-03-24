import React, { PropTypes, Component } from 'react';
import CompilationEmailNav from '../components/CompilationEmailNav';
import * as Actions from '../redux/actions/index';
import { connect } from 'react-redux';

class PreviewCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (!this.props.currentEmail.pdf) {
      this.props.dispatch(Actions.getCompilationEmailPdf(this.props.compilation._id, this.props.currentEmail));
    }
  }
  renderPreview() {
    if (this.props.currentEmail) {
      return (
        <div>
          <CompilationEmailNav email={this.props.currentEmail} currentPage="preview" removeEmail={this.removeEmail} />
          PDF Preview here
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
