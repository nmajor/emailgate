import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationAddEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.id }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.id }) || {};
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <div className="container">
          <h1>Add Emails to Compilation</h1>
          <SelectAccountContainer />
          <FilterContainer />
          <FilteredAccountEmailsContainer />
        </div>
      </div>
    );
  }
}

CompilationAddEmailsContainer.need = [(params, cookie) => {
  return Actions.getCompilations.bind(null, cookie)();
}];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    compilations: store.compilations,
  };
}

CompilationAddEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationAddEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationAddEmailsContainer);
