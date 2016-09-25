import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/GoogleFilterForm';

class GoogleFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filter: {},
      currentPage: 0,
    };

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
  }
  getResultRange() {
    const resultsPerPage = this.props.filteredAccountEmailsResults.resultsPerPage;
    const startingPage = 1 + (this.state.currentPage * resultsPerPage);
    const endingPage = startingPage + resultsPerPage;
    return <span>{startingPage} - {endingPage}</span>;
  }
  nextPage() {
    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('prevPageToken', this.props.filteredAccountEmailsResults.nextPageToken));
    this.state.currentPage = this.state.currentPage += 1;

    this.submitForm({
      q: this.state.filter.q,
      pageToken: this.props.filteredAccountEmailsResults.nextPageToken,
    });
  }
  prevPage() {
    this.state.currentPage = this.state.currentPage -= 1;

    this.submitForm({
      q: this.state.filter.q,
      pageToken: this.props.filteredAccountEmailsResults.prevPageToken,
    });
  }
  submitForm(props) {
    this.state.filter = {
      q: props.q,
      pageToken: props.pageToken,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, this.state.filter));
  }
  renderNavResults() {
    if (this.props.filteredAccountEmailsResults.count) {
      const nextToken = this.props.filteredAccountEmailsResults.nextPageToken;
      const prevToken = this.props.filteredAccountEmailsResults.prevPageToken;

      const resultInfo = <li><div className="filter-result-info">{this.getResultRange()} of {this.props.filteredAccountEmailsResults.count}</div></li>;

      const prevLink = <li className="previous" aria-hidden="true" onClick={this.prevPage}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></li>;

      const nextLink = <li className="next" aria-hidden="true" onClick={this.nextPage}><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></li>;

      return (<nav className="navresults">
        <ul className="pager">
          {prevToken ? prevLink : null}
          {resultInfo}
          {nextToken ? nextLink : null}
        </ul>
      </nav>);
    }
  }
  render() {
    return (<div>
      <FilterForm
        submitForm={this.submitForm}
        fetching={this.props.fetching.filteredAccountEmails}
        errors={this.props.filteredAccountEmailsResults.errors}
      />
      {this.renderNavResults()}
      <div className="navresults"></div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
  };
}

GoogleFilterFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  fetching: PropTypes.object.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(GoogleFilterFormContainer);
