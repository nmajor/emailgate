import React, { PropTypes, Component } from 'react';
import CompilationEmailsListItem from './CompilationEmailsListItem';
import CompilationPagesListItem from './CompilationPagesListItem';
import * as sharedHelpers from '../helpers';
import { Link } from 'react-router';

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
      return (<CompilationEmailsListItem
        key={`${email._id}`}
        current={email._id === this.props.currentEmailId}
        email={email}
      />);
    });
  }
  renderPages() {
    return this.sortedPages().map((page) => {
      return (<CompilationPagesListItem
        key={`${page._id}`}
        current={page._id === this.props.currentPageId}
        page={page}
      />);
    });
  }
  renderAddEmailLink() {
    return (<Link
      className="btn btn-success btn-block bottom-bumper"
      to={`/compilations/${this.props.compilation._id}/add-emails`}
    >
      Add Emails
    </Link>);
  }
  render() {
    return (
      <div>
        <div className="side-scroll">
          <div className="pages-list">
            {this.renderPages()}
          </div>
          <div className="emails-list">
            {this.renderEmails()}
          </div>
        </div>
      </div>
    );
  }
}

CompilationComponentsList.propTypes = {
  compilation: PropTypes.object.isRequired,
  emails: PropTypes.array.isRequired,
  pages: PropTypes.array.isRequired,
  currentEmailId: PropTypes.string,
  currentPageId: PropTypes.string,
};

export default CompilationComponentsList;
