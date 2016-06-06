import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import * as sharedHelpers from '../helpers';
import CompilationPdfPreviewContainer from './CompilationPdfPreviewContainer';
import { Link } from 'react-router';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.approve = this.approve.bind(this);
    this.pdfsCurrent = sharedHelpers.pdfsCurrent(this.props.compilationPages, this.props.compilationEmails);
    this.lastPdfUpdatedAt = sharedHelpers.lastPdfUpdatedAt(this.props.compilationPages, this.props.compilationEmails);
  }
  componentWillReceiveProps(nextProps) {
    this.pdfsCurrent = sharedHelpers.pdfsCurrent(nextProps.compilationPages, nextProps.compilationEmails);
    this.lastPdfUpdatedAt = sharedHelpers.lastPdfUpdatedAt(nextProps.compilationPages, nextProps.compilationEmails);
  }
  approve() {
    this.props.dispatch(Actions.updateCompilation(this.props.compilation, { approvedAt: new Date() }));
  }
  renderApproval() {
    return (<div>
      <div className="box bottom-bumper">
        <div className="bottom-bumper">Please scroll through and check the entire document.</div>
        <div className="bottom-bumper">When you are satisfied with the document, click below to continue.</div>
      </div>
      <div className="btn btn-success btn-block" onClick={this.approve}>Approve Preview</div>
    </div>);
  }
  renderCheckoutReady() {
    return (<div>
      <div className="box bottom-bumper">
        <div className="bottom-bumper">There have been no changes made to the compilation since you marked it approved.</div>
        <h5>You are ready to checkout!</h5>
      </div>
      <Link className="btn btn-success btn-block" to={`/compilations/${this.props.compilation._id}/checkout`}>
        Checkout
      </Link>
    </div>);
  }
  renderActions() {
    if (this.props.compilation.approvedAt >= this.lastPdfUpdatedAt) {
      return this.renderCheckoutReady();
    }

    return this.renderApproval();
  }
  render() {
    return (<div className="row">
      <div className="col-md-3">
        {this.renderActions()}
      </div>
      <div className="col-md-9">
        <CompilationPdfPreviewContainer />
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPreviewContainer);
