import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class FilteredAccountActions extends Component {
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
    const startingPage = 1 + (this.currentPage() * resultsPerPage);
    const endingPage = startingPage + resultsPerPage - 1;
    return <span>{startingPage} - {endingPage}</span>;
  }
  pageTokens() {
    return this.props.filteredAccountEmailsResults.pageTokens || [];
  }
  currentPage() {
    return this.pageTokens().length;
  }
  nextPage() {
    const pageTokens = this.pageTokens();
    pageTokens.push(this.props.filteredAccountEmailsResults.nextPageToken);

    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('pageTokens', pageTokens));

    this.props.submitForm({
      pageToken: this.props.filteredAccountEmailsResults.nextPageToken,
    });
  }
  prevPage() {
    const pageTokens = this.pageTokens();
    pageTokens.pop(); // The last token is the current page token
    const prevPageToken = pageTokens.length > 0 ? pageTokens[pageTokens.length - 1] : undefined;

    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('pageTokens', pageTokens));

    this.props.submitForm({
      pageToken: prevPageToken,
    });
  }
  renderNavResults() {
    if (this.props.filteredAccountEmailsResults.count) {
      const showNext = !!(this.props.filteredAccountEmailsResults.nextPageToken);

      const showPrev = this.pageTokens().length > 0;

      const resultInfo = <div className="filter-result-info">{this.getResultRange()} of {this.props.filteredAccountEmailsResults.count}</div>;

      const prevLink = <span aria-hidden="true" onClick={this.prevPage}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></span>;

      const nextLink = <span className="next" aria-hidden="true" onClick={this.nextPage}><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></span>;

      return (<div className="text-right">
          {showPrev ? prevLink : null}
          {resultInfo}
          {showNext ? nextLink : null}
      </div>);
    }
  }
  renderActions() {}
  render() {
    return (<div className="row">
      <div className="col-md-6">
        {this.renderActions()}
      </div>
      <div className="col-md-6">
        {this.renderNavResults()}
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
  };
}

FilteredAccountActions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FilteredAccountActions);
