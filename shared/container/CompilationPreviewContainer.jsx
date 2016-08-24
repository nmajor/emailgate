import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import * as sharedHelpers from '../helpers';
import CompilationPdfPreviewContainer from './CompilationPdfPreviewContainer';
// import ComponentPdfStatusThumbContainer from './ComponentPdfStatusThumbContainer';
import { Link } from 'react-router';
import Loading from '../components/Loading';
import _ from 'lodash';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};

    this.approve = this.approve.bind(this);
    // this.pdfsCurrent = sharedHelpers.pdfsCurrent(this.props.compilationPages, this.props.compilationEmails);
    this.componentsWithObsoletePdf = sharedHelpers.withObsoletePdf(this.props.compilationPages, this.props.compilationEmails);
    this.lastPdfUpdatedAt = sharedHelpers.lastPdfUpdatedAt(this.props.compilationPages, this.props.compilationEmails);
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
    this.updateObsoletePdfs = this.updateObsoletePdfs.bind(this);
  }
  componentDidMount() {
    if (this.componentsWithObsoletePdf.length > 0) {
      this.updateObsoletePdfs();
      this.startPolling();
    }
  }
  componentWillReceiveProps(nextProps) {
    // this.pdfsCurrent = sharedHelpers.pdfsCurrent(nextProps.compilationPages, nextProps.compilationEmails);
    this.componentsWithObsoletePdf = sharedHelpers.withObsoletePdf(nextProps.compilationPages, nextProps.compilationEmails);
    this.lastPdfUpdatedAt = sharedHelpers.lastPdfUpdatedAt(nextProps.compilationPages, nextProps.compilationEmails);

    if (!(this.componentsWithObsoletePdf.length > 0) && this._timer) {
      this.stopPolling();
    }
  }
  componentWillUnmount() {
    this.stopPolling();
  }
  startPolling() {
    this._timer = setInterval(() => {
      console.log('polling');
      this.updateObsoletePdfs();
    }, 3000);
  }
  stopPolling() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  updateObsoletePdfs() {
    const emailsWithObsoletePdfs = _.filter(this.componentsWithObsoletePdf, (component) => { return component.mid; });
    const pagesWithObsoletePdfs = _.filter(this.componentsWithObsoletePdf, (component) => { return !component.mid; });

    if (emailsWithObsoletePdfs.length > 0) {
      const emailIds = _.map(emailsWithObsoletePdfs, (email) => { return email._id; });
      this.props.dispatch(Actions.refreshEmailPdfs(this.props.compilation._id, emailIds));
    }
    if (pagesWithObsoletePdfs.length > 0) {
      const pageIds = _.map(pagesWithObsoletePdfs, (page) => { return page._id; });
      this.props.dispatch(Actions.refreshPagePdfs(this.props.compilation._id, pageIds));
    }
  }
  approve() {
    if (!(this.componentsWithObsoletePdf.length > 0)) {
      this.props.dispatch(Actions.updateCompilation(this.props.compilation, { approvedAt: new Date() }));
    }
  }
  renderApproval() {
    return (<div>
      <div className="box bottom-bumper">
        <div>When you are satisfied with your email book, please approve it by clicking the button below.</div>
      </div>
      <div className={`btn btn-success btn-block bottom-bumper ${this.componentsWithObsoletePdf.length > 0 ? 'disabled' : ''}`} onClick={this.approve}>Approve Preview</div>
    </div>);
  }
  renderCheckoutReady() {
    return (<div>
      <div className="box bottom-bumper">
        <div className="bottom-bumper">There have been no changes made to the compilation since you marked it as approved.</div>
        <h5>You are ready to checkout!</h5>
      </div>
      <Link className="btn btn-success btn-block" to={`/compilations/${this.props.compilation._id}/checkout`}>
        Checkout
      </Link>
    </div>);
  }
  renderUpdatingComponents() {
    return (<div className="padded-box text-center">
      <span className="outside-button-loading"><Loading /></span> Updating {this.componentsWithObsoletePdf.length} pdfs.
    </div>);
    // const componentStatusThumbs = this.componentsWithObsoletePdf.map((component) => {
    //   return <ComponentPdfStatusThumbContainer key={component._id} component={component} />;
    // });
    // return (<div>{componentStatusThumbs}</div>);
  }
  renderActions() {
    if (this.props.compilation.approvedAt >= this.lastPdfUpdatedAt && !(this.componentsWithObsoletePdf.length > 0)) {
      return this.renderCheckoutReady();
    }

    return this.renderApproval();
  }
  renderPreview() {
    if (this.componentsWithObsoletePdf.length > 0) {
      return this.renderUpdatingComponents();
    }
    return <CompilationPdfPreviewContainer />;
  }
  render() {
    return (<div className="row">
      <div className="col-sm-3">
        {this.renderActions()}
      </div>
      <div className="col-sm-9">
        {this.renderPreview()}
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
