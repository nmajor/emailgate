import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class FilteredEmailsSelectEverythingContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectEverything = this.selectEverything.bind(this);
    this.deselectEverything = this.deselectEverything.bind(this);
  }
  nonCompilationEmailIds() {
    return _.filter(this.props.filteredAccountEmailsResults.totalResultsIds, (id) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === id; });
    });
  }
  selectEverything() {
    const filteredEmailIds = this.nonCompilationEmailIds();
    const selectedEmailIds = this.props.selectedFilteredEmailIds;
    const emailIds = _.union(filteredEmailIds, selectedEmailIds);
    this.props.dispatch(Actions.setSelectedFilteredEmailIds(emailIds));
  }
  deselectEverything() {
    this.props.dispatch(Actions.setSelectedFilteredEmailIds([]));
  }
  renderAction() {
    if (this.props.selectedFilteredEmailIds > 0 && this.nonCompilationEmailIds().length === this.props.selectedFilteredEmailIds.length) {
      return (<span className="btn btn-default btn-xs-true" onClick={this.deselectEverything}><span className="glyphicon glyphicon-check" aria-hidden="true"></span> Unselect all {this.nonCompilationEmailIds().length} emails</span>);
    }
    return (<span className="btn btn-default btn-xs-true" onClick={this.selectEverything}><span className="glyphicon glyphicon-unchecked" aria-hidden="true"></span> Select all {this.nonCompilationEmailIds().length} un-added emails</span>);
  }
  render() {
    return (<span>
      {this.renderAction()}
      blah {this.props.filteredAccountEmailsResults.totalResultsIds.length}
      {_.filter(this.props.filteredAccountEmailsResults.totalResultsIds, (id) => { return id.indexOf('13') > -1; }).join(' ')}
    </span>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
  };
}

FilteredEmailsSelectEverythingContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(FilteredEmailsSelectEverythingContainer);
