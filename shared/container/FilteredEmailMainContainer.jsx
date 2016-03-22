import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredEmailMain from '../components/FilteredEmailMain';
import _ from 'lodash';

class FilteredEmailMainContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);
  }
  removeEmailFromCompilation(email) {
    const compilationEmail = _.find(this.props.compilationEmails, { mid: email.mid });
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, compilationEmail));
  }
  render() {
    return (
      <FilteredEmailMain
        email={this.props.currentFilteredEmail}
        isCompilationEmail={this.props.compilationEmailMids.indexOf(this.props.currentFilteredEmail.mid) > -1}
        removeEmailFromCompilation={this.removeEmailFromCompilation}
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
