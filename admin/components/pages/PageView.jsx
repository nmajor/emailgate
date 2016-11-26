import React, { PropTypes, Component } from 'react';

class PageView extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderPageHtml() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.page.html }}></div>;
  }
  renderPdfLink() {
    if (this.props.page.pdf && this.props.page.pdf.url) {
      return <a className="btn btn-default right-bumper" target="_blank" href={this.props.page.pdf.url}>Page Pdf</a>;
    }
  }
  render() {
    return (<div>
      <h1>Page</h1>
      <div className="row">
        <div className="col-sm-6">
          <div className="padded-box bottom-bumper">
            {this.renderPdfLink()}
          </div>
        </div>
      </div>
      {this.renderPageHtml()}
    </div>);
  }
}

PageView.propTypes = {
  page: PropTypes.object.isRequired,
  buildPdf: PropTypes.object.isRequired,
};

export default PageView;
