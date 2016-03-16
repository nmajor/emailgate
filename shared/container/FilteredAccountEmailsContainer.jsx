import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import FilteredAccountEmails from '../components/FilteredAccountEmails';

class FilteredAccountEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className="filter-container">
        <FilteredAccountEmails emails={this.props.filteredAccountEmails} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmails: store.filteredAccountEmails,
  };
}

FilteredAccountEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filteredAccountEmails: PropTypes.array,
};

export default connect(mapStateToProps)(FilteredAccountEmailsContainer);
