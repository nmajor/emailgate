import React, { PropTypes, Component } from 'react';
import CompilationEmailPreview from '../components/CompilationEmailPreview';
import CompilationEmailMainActions from '../components/CompilationEmailMainActions';
import CompilationEmailFormContainer from './CompilationEmailFormContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationEmailMainContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);
    this.setEditingSelectedEmail = this.setEditingSelectedEmail.bind(this);

    this.currentCompilationEmail = _.find(this.props.compilationEmails, { _id: this.props.currentCompilationEmailId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentCompilationEmail = _.find(nextProps.compilationEmails, { _id: nextProps.currentCompilationEmailId });
  }
  setEditingSelectedEmail(val) {
    this.props.dispatch(Actions.setEditingCurrentCompilationEmail(val));
  }
  removeEmailFromCompilation(email) {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, email));
  }

  renderCompilationEmailMainActions() {
    if (this.currentCompilationEmail) {
      return (<CompilationEmailMainActions
        email={this.currentCompilationEmail}
        removeEmail={this.removeEmailFromCompilation}
        setEditing={this.setEditingSelectedEmail}
        editing={this.props.editingCurrentCompilationEmail}
      />);
    }
  }
  renderCompilationEmailMain() {
    if (!this.currentCompilationEmail) { return null; }

    if (this.props.editingCurrentCompilationEmail) {
      return (<CompilationEmailFormContainer
        compilation={this.props.compilation}
        email={this.currentCompilationEmail}
      />);
    }

    return (<CompilationEmailPreview
      email={this.currentCompilationEmail}
    />);
  }
  render() {
    return (<div>
      {this.renderCompilationEmailMainActions()}
      {this.renderCompilationEmailMain()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    currentCompilationEmailId: store.currentCompilationEmailId,
    editingCurrentCompilationEmail: store.editingCurrentCompilationEmail,
  };
}

CompilationEmailMainContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentCompilationEmailId: PropTypes.string,
  editingCurrentCompilationEmail: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(CompilationEmailMainContainer);
