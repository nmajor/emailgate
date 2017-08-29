import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import CompilationEmailsListItem from './CompilationEmailsListItem';
import CompilationPagesListItem from './CompilationPagesListItem';
import AddCustomPageContainer from '../container/AddCustomPageContainer';
import * as sharedHelpers from '../helpers';
// import { Link } from 'react-router';

class CompilationComponentsList extends Component {
  constructor(props, context) {
    super(props, context);
    this.sortedEmails = this.sortedEmails.bind(this);
    this.sortedPages = this.sortedPages.bind(this);
  }
  sortedEmails() {
    return sharedHelpers.sortedEmails(this.props.emails);
  }
  sortedPages() {
    return sharedHelpers.sortedPages(this.props.pages);
  }
  renderEmails() {
    return this.sortedEmails().map((email) => {
      const current = email._id === this.props.currentEmailId;
      let show = 'thumb';
      if (current && this.props.edit) {
        show = 'edit';
      } else if (current) {
        show = 'view';
      }

      return (<CompilationEmailsListItem
        key={`${email._id}`}
        email={email}
        show={show}
        edit={this.props.edit}
        rotateAttachment={this.props.rotateAttachment}
        componentProps={this.props.componentProps || {}}
      />);
    });
  }
  renderPages() {
    return _.flatten(this.sortedPages().map((page) => {
      const current = page._id === this.props.currentPageId;
      let show = 'thumb';
      if (current && this.props.edit) {
        show = 'edit';
      } else if (current) {
        show = 'view';
      }

      let addCustomPage = (<AddCustomPageContainer
        compilation={this.props.compilation}
        afterObject={page}
        afterType="page"
        afterId={page._id}
      />);

      if (page.type === 'table-of-contents') { addCustomPage = null; }

      return (<div key={`${page._id}`}>
        <CompilationPagesListItem
          page={page}
          show={show}
          edit={this.props.edit}
          componentProps={this.props.componentProps || {}}
        />
        {addCustomPage}
      </div>);
    }));
  }
  render() {
    return (<div className="component-list">
      <div className="pages-list">
        {this.renderPages()}
      </div>
      <div className="emails-list">
        {this.renderEmails()}
      </div>
    </div>);
  }
}

CompilationComponentsList.propTypes = {
  compilation: PropTypes.object.isRequired,
  emails: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired,
  currentEmailId: PropTypes.string,
  currentPageId: PropTypes.string,
  edit: PropTypes.func,
  componentProps: PropTypes.object,
  rotateAttachment: PropTypes.func,
};

export default CompilationComponentsList;
