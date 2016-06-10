import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as sharedHelpers from '../helpers';
import ComponentPdfContainer from './ComponentPdfContainer';
import { emailPageMap } from '../helpers';

class CompilationPdfPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pdfs: 5,
      loadedPdfs: 0,
    };

    this.onPdfLoaded = this.onPdfLoaded.bind(this);
    this.loadedAllPdfs = this.loadedAllPdfs.bind(this);
    this.loadMorePdfs = this.loadMorePdfs.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.sortedComponents = this.sortedComponents.bind(this);

    this.emailPageMap = emailPageMap(this.props.compilationEmails);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillReceiveProps(nextProps) {
    this.emailPageMap = emailPageMap(nextProps.compilationEmails);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  onPdfLoaded() {
    this.setState({ loadedPdfs: this.state.loadedPdfs + 1 });
  }
  loadedAllPdfs() {
    return this.state.pdfs === [...this.props.compilationPages, ...this.props.compilationEmails].length;
  }
  loadMorePdfs() {
    this.setState({
      pdfs: this.state.pdfs + 2,
    });
  }
  loadingPdfs() {
    return this.state.pdfs > this.state.loadedPdfs;
  }
  handleScroll(event) {
    if (!this.loadedAllPdfs()) {
      const body = document.body;
      const html = document.documentElement;

      const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const scrollTop = event.srcElement.body.scrollTop;

      // console.log(height);
      // console.log(scrollTop);

      if ((height - scrollTop) < 1000 && !this.loadingPdfs()) {
        this.loadMorePdfs();
      }
    }
  }
  sortedComponents() {
    return sharedHelpers.sortedComponents(this.props.compilationPages, this.props.compilationEmails);
  }
  renderCompilationSummary() {
    return (<div>
      <h3>Summary</h3>
      <div>Pages: {this.props.compilationPages.length}</div>
      <div>Emails: {this.props.compilationEmails.length}</div>
    </div>);
  }
  renderCompilationPdf() {
    return this.sortedComponents().slice(0, this.state.pdfs).map((component) => {
      return (<ComponentPdfContainer
        key={component._id}
        component={component}
        onPagesComplete={this.onPdfLoaded}
        pageMap={this.emailPageMap}
      />);
    });
  }
  render() {
    return <div>{this.renderCompilationPdf()}</div>;
  }
}

function mapStateToProps(store) {
  return {
    queueJobMap: store.queueJobMap,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationPdfPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.array.isRequired,
  queueJobMap: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationPdfPreviewContainer);
