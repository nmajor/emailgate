import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredEmailsList from '../components/FilteredEmailsList';
// import FilteredEmailPreview from '../components/FilteredEmailPreview';
import FilteredEmailsListActions from '../components/FilteredEmailsListActions';
import _ from 'lodash';

class FilteredEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectEmail = this.selectEmail.bind(this);
    this.deselectEmail = this.deselectEmail.bind(this);
    this.setPreviewEmail = this.setPreviewEmail.bind(this);

    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.addSelectedToCompilation = this.addSelectedToCompilation.bind(this);
  }

  setPreviewEmail(email) {
    this.props.dispatch(Actions.setPreviewEmailMid(email.mid));
  }
  selectEmail(email) {
    this.props.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', true));
  }
  deselectEmail(email) {
    this.props.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', false));
  }
  selectAll() {
    const nonCompilationEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !this.props.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', true));
  }
  deselectAll() {
    const nonCompilationEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !this.props.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', false));
  }
  addSelectedToCompilation() {
    this.props.dispatch(Actions.addEmailsToCompilationEmails(this.props.compilation._id, _.filter(this.props.filteredAccountEmails, { selected: true })));
  }
  render() {
    return (
      <div>
        <FilteredEmailsListActions
          selectAll={this.selectAll}
          deselectAll={this.deselectAll}
          addSelectedToCompilation={this.addSelectedToCompilation}
          canAdd={_.some(this.props.filteredAccountEmails, { selected: true })}
        />
        <FilteredEmailsList
          emails={this.props.filteredAccountEmails}
          compilationEmailMids={this.props.compilationEmailMids}
          previewEmailMid={this.props.previewEmail.mid}
          deselectEmail={this.deselectEmail}
          selectEmail={this.selectEmail}
          setPreviewEmail={this.setPreviewEmail}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmails: store.filteredAccountEmails,
  };
}

FilteredEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  previewEmail: PropTypes.object,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(FilteredEmailsListContainer);