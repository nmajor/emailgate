import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { compilationTotalPageCountEstimate } from '../helpers';
import Loading from './Loading';

class CompilationHeader extends Component { // eslint-disable-line
  renderCoverPreview() {
    const { compilation } = this.props;

    if (_.get(compilation, 'thumbnail.content')) {
      const dataUriPrefix = `data:${compilation.thumbnail.contentType};base64,`;

      console.log(compilation.thumbnail.content);

      return (<img role="presentation" src={dataUriPrefix + compilation.thumbnail.content} />);
    }
  }
  renderTitle() {
    return <h1>{this.props.compilation.title}</h1>;
  }
  renderSubtitle() {
    if (!_.isEmpty(this.props.compilation.subtitle)) {
      return <h3>{this.props.compilation.subtitle}</h3>;
    }
  }
  renderEmailsCount() {
    const { compilation, compilationEmails } = this.props;
    let emailsCount = compilation.emails.length;

    if (emailsCount !== compilationEmails.length) {
      emailsCount = compilationEmails.length;
    }

    return (<span className="badge right-bumper"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> Emails {emailsCount}</span>);
  }
  renderEstPages() {
    const { compilation } = this.props;
    const pagesCount = compilationTotalPageCountEstimate(compilation);

    return (<span className="badge"><span className="glyphicon glyphicon-file" aria-hidden="true"></span> Estimated Pages {pagesCount}</span>);
  }
  renderMetaData() {
    return (<div className="meta-data">
      {this.renderEmailsCount()}
      {this.renderEstPages()}
    </div>);
  }
  renderHeaderNotice() {
    if (this.props.addingFilteredEmailIds.length > 0) {
      return (<div className="compilation-header-notice">
        <span className="button-loading">
          <Loading /></span> Adding {this.props.addingFilteredEmailIds.length} emails. This can take a while...
      </div>);
    }
  }
  render() {
    return (<div>
      <div className="compilation-header">
        <div className="container">
          <div className="thumb">
            {this.renderCoverPreview()}
          </div>
          <div className="details">
            {this.renderTitle()}
            {this.renderSubtitle()}
            {this.renderMetaData()}
          </div>
        </div>
      </div>
      {this.renderHeaderNotice()}
    </div>);
  }
}

CompilationHeader.propTypes = {
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  addingFilteredEmailIds: PropTypes.array.isRequired,
};

export default CompilationHeader;
