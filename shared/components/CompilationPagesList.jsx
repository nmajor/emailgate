import React, { PropTypes, Component } from 'react';
import CompilationPagesListItem from './CompilationPagesListItem';
import * as sharedHelpers from '../helpers';

class CompilationPagesList extends Component {
  constructor(props, context) {
    super(props, context);
    this.sortedPages = this.sortedPages.bind(this);
  }
  sortedPages() {
    return sharedHelpers.sortedPages(this.props.pages);
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
  render() {
    return (
      <div className="pages-list">
        {this.renderPages()}
      </div>
    );
  }
}

CompilationPagesList.propTypes = {
  pages: PropTypes.array.isRequired,
  currentPageId: PropTypes.string,
};

export default CompilationPagesList;
