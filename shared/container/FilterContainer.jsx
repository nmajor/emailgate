import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className="filter-container">
        <h3>Filter</h3>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filter: store.filter,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filter: PropTypes.object,
};

export default connect(mapStateToProps)(FilterContainer);
