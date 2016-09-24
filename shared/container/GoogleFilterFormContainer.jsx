import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/GoogleFilterForm';

class GoogleFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filter: {
        pageTokens: [undefined],
        pageTokenIndex: 0,
      },
    };

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
  }
  nextPage() {
    this.props.dispatch(Actions.setPropertyFilteredAccountEmailsResults('prevPageToken', this.props.filteredAccountEmailsResults.nextPageToken));

    this.submitForm({
      q: this.state.filter.q,
      pageToken: this.props.filteredAccountEmailsResults.nextPageToken,
    });
  }
  prevPage() {
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
      const resultInfo = <li><div className='filter-result-info'>1-20 of {this.props.filteredAccountEmailsResults.count}</div></li>;

      const prevLink = <li className="previous" aria-hidden="true" onClick={this.prevPage}><span>&larr; Prev</span></li>;

      const nextLink = <li className="next" aria-hidden="true" onClick={this.nextPage}><span>Older &rarr;</span></li>;

      return (<nav className="navresults">
        <ul className="pager">
          {prevLink}
          {resultInfo}
          {nextLink}
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
      <div onClick={this.nextPage}>next</div>
      <div onClick={this.prevPage}>prev</div>
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
