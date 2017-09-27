import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
// import FilteredEmailsSelectEverythingContainer from '../container/FilteredEmailsSelectEverythingContainer';

class FilteredEmailsActions extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filter: {},
      pageTokens: [],
    };

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }
  getResultRange() {
    const resultsPerPage = this.props.filteredAccountEmailsResults.resultsPerPage;
    const resultsCount = this.props.filteredAccountEmailsResults.resultsCount;
    const startingPage = 1 + (this.currentPage() * resultsPerPage);
    const endingPage = startingPage + resultsCount - 1;
    // endingPage = endingPage > this.props.filteredAccountEmailsResults.count ? this.props.filteredAccountEmailsResults.count : endingPage;
    return <span>{startingPage} - {endingPage}</span>;
  }
  pageTokens() {
    return this.props.filteredAccountEmailsResults.pageTokens || [];
  }
  currentPage() {
    return this.pageTokens().length;
  }
  nextPage() {
    if (!this.showNext()) { return; }

    const pageTokens = this.pageTokens();
    pageTokens.push(this.props.filteredAccountEmailsResults.nextPageToken);

    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('pageTokens', pageTokens));

    this.props.submitForm({
      pageToken: this.props.filteredAccountEmailsResults.nextPageToken,
    });
  }
  prevPage() {
    if (!this.showPrev()) { return; }

    const pageTokens = this.pageTokens();
    pageTokens.pop(); // The last token is the current page token
    const prevPageToken = pageTokens.length > 0 ? pageTokens[pageTokens.length - 1] : undefined;

    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('pageTokens', pageTokens));

    this.props.submitForm({
      pageToken: prevPageToken,
    });
  }
  showNext() {
    return !!(this.props.filteredAccountEmailsResults.nextPageToken);
  }
  showPrev() {
    return this.pageTokens().length > 0;
  }
  renderNavResults() {
    if (this.props.filteredAccountEmailsResults.count) {
      const resultInfo = <div className="filter-result-info">{this.getResultRange()} of {this.props.filteredAccountEmailsResults.count}{this.props.filteredAccountEmailsResults.moreThanTotalResults ? '+' : ''}</div>;

      const prevLink = (<span
        className={`prev btn btn-default btn-xs-true ${!this.showPrev() ? 'disabled' : ''}`}
        aria-hidden="true"
        onClick={this.prevPage}
      >
        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      </span>);

      const nextLink = (<span
        className={`next btn btn-default btn-xs-true ${!this.showNext() ? 'disabled' : ''}`}
        id="filtered-emails-next-link"
        aria-hidden="true"
        onClick={this.nextPage}
      >
        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      </span>);

      return (<div className="navresults text-right">
          {prevLink}
          {resultInfo}
          {nextLink}
      </div>);
    }
  }
  renderCheckAll() {
    if (this.props.allSelected) {
      return (<span className="my-checkbox checked" onClick={this.props.deselectAll}>
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </span>);
    }

    return (<span className="my-checkbox" onClick={this.props.selectAll}>
    </span>);
  }
  renderSelectedCount() {
    const selectedCount = this.props.selectedFilteredEmailIds.length;
    return (<span className="right-bumper">{selectedCount} <span className="glyphicon glyphicon-ok" aria-hidden="true"></span></span>);
  }
  renderAddAction() {
    return (<span className="btn btn-default btn-xs-true" onClick={this.props.addSelected}>Add <span className="glyphicon glyphicon-check" aria-hidden="true"></span> to Email Book</span>);
  }
  renderSelectAllAction() {
    return null;
    // the returned totalResultsIds are not consistent with the emails returned page by page so hiding this for now.

    // if (this.props.filteredAccountEmailsResults.count && this.props.filteredAccountEmailsResults.count > 0) {
    //   return <FilteredEmailsSelectEverythingContainer />;
    // }
  }
  renderActions() {
    if (this.props.filteredAccountEmailsResults.count) {
      return (<div className="filter-email-actions">
        {this.renderCheckAll()}
        {this.renderSelectedCount()}
        {this.renderSelectAllAction()}
      </div>);
    }
  }
  render() {
    return (<div className="row">
      <div className="col-sm-6 col-xs-4">
        {this.renderActions()}
      </div>
      <div className="col-sm-6 col-xs-8">
        {this.renderNavResults()}
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
  };
}

FilteredEmailsActions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  selectEverything: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  addSelected: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(FilteredEmailsActions);
