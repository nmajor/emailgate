import React, { PropTypes, Component } from 'react';
import CompilationPagesListItem from './CompilationPagesListItem';

class CompilationPagesList extends Component {
  renderPages() {
    return this.props.pages.map((page) => {
      return (<CompilationPagesListItem
        key={`${page._id}`}
        selected={page._id === this.props.currentPageId}
        page={page}
      />);
    });
  }
  render() {
    return (
      <div className="emails-list">
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
