import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredEmailView from '../components/FilteredEmailView';
import _ from 'lodash';

class FilteredEmailMainContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);
    this.addEmailToCompilation = this.addEmailToCompilation.bind(this);
  }
  removeEmailFromCompilation(email) {
    const compilationEmail = _.find(this.props.compilationEmails, { mid: email.mid });
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, compilationEmail));
  }
  addEmailToCompilation(email) {
    this.props.dispatch(Actions.addEmailsToCompilationEmails(this.props.compilation._id, [email]));
  }
  render() {
    return (
      <FilteredEmailView
        email={this.props.currentFilteredEmail}
        compilation={this.props.compilation}
        compilationEmail={_.find(this.props.compilationEmails, { mid: this.props.currentFilteredEmail.mid })}
        removeEmailFromCompilation={this.removeEmailFromCompilation}
        addEmailToCompilation={this.addEmailToCompilation}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

FilteredEmailMainContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  currentFilteredEmail: PropTypes.object,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(FilteredEmailMainContainer);
