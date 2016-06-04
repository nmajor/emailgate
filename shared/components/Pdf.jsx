import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

if (typeof window !== 'undefined') {
  require('pdfjs-dist/build/pdf.combined'); // eslint-disable-line global-require
}

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: {},
    };
    this.onDocumentComplete = this.onDocumentComplete.bind(this);
    this.onPageComplete = this.onPageComplete.bind(this);
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
  }

  onDocumentComplete(pdf) {
    this.setState({ pdf });
    const { onDocumentComplete } = this.props;
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf.numPages);
    }

    console.log('blah 1');
    console.log(this.props.pages);
    console.log('blah 2');
    console.log(_.range(this.props.pages));
    _.forEach(_.range(this.props.pages), (page) => {
      pdf.getPage(page + 1).then(this.onPageComplete);
    });
  }

  onPageComplete(page) {
    const newPagesState = this.state.pages;
    newPagesState[`page-${page.pageIndex + 1}`] = page;
    this.setState({ pages: newPagesState });
    console.log(`page ${page.pageIndex + 1}`);
    // this.setState({ page });
    this.renderPdf(page.pageIndex);
    const { onPageComplete } = this.props;
    if (typeof onPageComplete === 'function') {
      onPageComplete(page.pageIndex);
    }
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
    const page = this.state.pages[`page-${pageIndex + 1}`];
    console.log('blah yoda');
    console.log(page.pageIndex);
    console.log(this.refs);
    if (page) {
      let canvas = this.refs[`page-${page.pageIndex + 1}`];
      if (canvas.getDOMNode) { // compatible with react 0.13
        canvas = canvas.getDOMNode();
      }
      const canvasContext = canvas.getContext('2d');
      const { scale } = this.props;
      const viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render({ canvasContext, viewport });
    }
  }
  renderPageCanvas() {

  }
  renderPages() {
    return _.map(this.state.pages, (page) => {
      return <div className="pdf-wrapper"><canvas ref={`page-${page.pageIndex + 1}`} /></div>;
    });
    // const loadedPages = _.filter(_.range(this.props.pages), (index) => {
    //   return this.state.pages[`page-${index + 1}`];
    // });
    // console.log('blah loadedPages');
    // console.log(loadedPages);
    // return loadedPages.map((pageIndex) => {
    //   return <canvas ref={`page-${page.pageIndex + 1}`} />;
    // });
  }

  render() {
    if (this.props.loading) {
      return <div>Loading Pdf ...</div>;
    }

    return (<div className="pdf">
      {this.renderPages()}
    </div>);
    // const { loading } = this.props;
    // const { page } = this.state;
    // return page ? <canvas ref="canvas" width="100%" /> : loading || <div>Loading PDF...</div>;
  }
}
Pdf.displayName = 'React-PDFjs';
Pdf.propTypes = {
  content: PropTypes.string,
  file: PropTypes.string,
  loading: PropTypes.any,
  page: PropTypes.number,
  pages: PropTypes.number,
  scale: PropTypes.number,
  onDocumentComplete: PropTypes.func,
  onPageComplete: PropTypes.func,
};
Pdf.defaultProps = { page: 1, pages: 1, scale: 1.0 };

export default Pdf;
