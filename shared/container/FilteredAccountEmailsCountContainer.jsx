import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredAccountEmailsCount from '../components/FilteredAccountEmailsCount';

class FilteredAccountEmailsCountContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className="filtered-account-emails-count-container">
        <FilteredAccountEmailsCount filteredAccountEmailsCount={this.props.filteredAccountEmailsCount} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmailsCount: store.filteredAccountEmailsCount,
  };
}

FilteredAccountEmailsCountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filteredAccountEmailsCount: PropTypes.number,
};

export default connect(mapStateToProps)(FilteredAccountEmailsCountContainer);
