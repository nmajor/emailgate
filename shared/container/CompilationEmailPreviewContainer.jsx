import React, { PropTypes, Component } from 'react';
import CompilationEmailPreview from '../components/CompilationEmailPreview';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationEmailPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);
    this.setEditingSelectedEmail = this.setEditingSelectedEmail.bind(this);

    if (this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(this.props.compilationEmails, { _id: this.props.selectedCompilationEmailId }) || {};
    } else { this.selectedCompilationEmail = {}; }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCompilationEmailId !== this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(nextProps.compilationEmails, { _id: nextProps.selectedCompilationEmailId }) || {};
    }
  }
  setEditingSelectedEmail(val) {
    this.props.dispatch(Actions.setEditingSelectedCompilationEmail(val));
  }
  removeEmailFromCompilation(email) {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, email));
  }

  render() {
    return (
      <CompilationEmailPreview
        email={this.selectedCompilationEmail}
        removeEmail={this.removeEmailFromCompilation}
        setEditing={this.setEditingSelectedEmail}
        editing={this.props.editingSelectedCompilationEmail}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    selectedCompilationEmailId: store.selectedCompilationEmailId,
    editingSelectedCompilationEmail: store.editingSelectedCompilationEmail,
  };
}

CompilationEmailPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
  editingSelectedCompilationEmail: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(CompilationEmailPreviewContainer);
