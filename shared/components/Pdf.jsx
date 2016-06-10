import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

if (typeof window !== 'undefined') {
  require('pdfjs-dist/build/pdf.combined'); // eslint-disable-line global-require
}

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: {},
      showActions: false,
    };
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
    this.showActions = this.showActions.bind(this);
    this.hideActions = this.hideActions.bind(this);
  }

  componentDidMount() {
    this.loadPDFDocument(this.props);
    this.renderPdf();
  }

  componentWillReceiveProps(newProps) {
    const { pdf } = this.state;
    if ((newProps.file && newProps.file !== this.props.file) ||
      (newProps.content && newProps.content !== this.props.content)) {
      this.loadPDFDocument(newProps);
    }

    if (pdf && ((newProps.page && newProps.page !== this.props.page) ||
      (newProps.scale && newProps.scale !== this.props.scale))) {
      this.setState({ page: null });
      pdf.getPage(newProps.page).then(this.onPageComplete);
    }

    if (pdf && ((newProps.pages && newProps.pages !== this.props.pages) ||
      (newProps.scale && newProps.scale !== this.props.scale))) {
      this.setState({ pages: {} });

      const getPages = _.map(_.range(this.props.pages), (page) => {
        return pdf.getPage(page + 1).then((p) => { return this.onPageComplete(p); });
      });

      Promise.all(getPages)
      .then(() => {
        if (typeof this.props.onPagesComplete === 'function') {
          this.props.onPagesComplete();
        }
      });
    }
  }

  onDocumentComplete(pdf) {
    this.setState({ pdf });
    const { onDocumentComplete } = this.props;
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf.numPages);
    }

    const getPages = _.map(_.range(this.props.pages), (page) => {
      return pdf.getPage(page + 1).then((p) => { return this.onPageComplete(p); });
    });

    Promise.all(getPages)
    .then(() => {
      if (typeof this.props.onPagesComplete === 'function') {
        this.props.onPagesComplete();
      }
    });
  }

  onPageComplete(page) {
    return new Promise((resolve) => {
      const newPagesState = this.state.pages;
      newPagesState[`page-${page.pageIndex + 1}`] = page;
      this.setState({ pages: newPagesState });

      resolve(this.renderPdf(page.pageIndex));
      const { onPageComplete } = this.props;
      if (typeof onPageComplete === 'function') {
        onPageComplete(page.pageIndex);
      }
    });
  }
  showActions() {
    this.setState({ showActions: true });
  }
  hideActions() {
    this.setState({ showActions: false });
  }

  loadByteArray(byteArray) {
    window.PDFJS.getDocument(byteArray).then(this.onDocumentComplete);
  }

  loadPDFDocument(props) {
    if (!!props.file) {
      if (typeof props.file === 'string') {
        return window.PDFJS.getDocument(props.file)
          .then(this.onDocumentComplete);
      }
      // Is a File object
      const reader = new FileReader();
      reader.onloadend = () =>
        this.loadByteArray(new Uint8Array(reader.result));
      reader.readAsArrayBuffer(props.file);
    } else if (!!props.content) {
      const bytes = window.atob(props.content);
      const byteLength = bytes.length;
      const byteArray = new Uint8Array(new ArrayBuffer(byteLength));
      for (let index = 0; index < byteLength; index++) {
        byteArray[index] = bytes.charCodeAt(index);
      }
      this.loadByteArray(byteArray);
    } else {
      throw new Error('React-PDFjs works with a file(URL) or (base64)content. At least one needs to be provided!');
    }

    return null;
  }

  renderPdf(pageIndex) {
    return new Promise((resolve) => {
      const page = this.state.pages[`page-${pageIndex + 1}`];
      if (page) {
        const canvas = this.refs[`page-${page.pageIndex + 1}`];
        // if (canvas.getDOMNode) { // compatible with react 0.13
        //   canvas = canvas.getDOMNode();
        // }
        const canvasContext = canvas.getContext('2d');
        const { scale } = this.props;
        const viewport = page.getViewport(scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext, viewport });
        resolve();
      }
    });
  }
  renderActions() {
    if (this.state.showActions) {
      return (<div className="actions">
        <Link to={this.props.editPath} className="btn btn-default btn-xs">
          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
        </Link>
      </div>);
    }
  }
  renderPageNumber(pageIndex) {
    if (this.props.pageNumOffset) {
      const pageNum = this.props.pageNumOffset + pageIndex;

      return <div className="page-num">{pageNum}</div>;
    }
  }
  renderPages() {
    return _.map(_.range(this.props.pages), (pageIndex) => {
      return (<div
        key={pageIndex}
        className="pdf-page"
        onMouseEnter={this.showActions}
        onMouseLeave={this.hideActions}
      >
        {this.renderActions()}
        <canvas ref={`page-${pageIndex + 1}`} />
        {this.renderPageNumber(pageIndex)}
      </div>);
    });
  }

  render() {
    if (this.props.loading) {
      return <div>Loading Pdf ...</div>;
    }

    return (<div className="pdf-wrapper">
      {this.renderPages()}
    </div>);
  }
}
Pdf.displayName = 'React-PDFjs';
Pdf.propTypes = {
  content: PropTypes.string,
  pdf: PropTypes.object,
  file: PropTypes.string,
  loading: PropTypes.any,
  page: PropTypes.number,
  pages: PropTypes.number,
  pageNumOffset: PropTypes.number,
  scale: PropTypes.number,
  onDocumentComplete: PropTypes.func,
  onPageComplete: PropTypes.func,
  onPagesComplete: PropTypes.func,
  editPath: PropTypes.string,
};
Pdf.defaultProps = { page: 1, pages: 1, scale: 2.0 };

export default Pdf;
