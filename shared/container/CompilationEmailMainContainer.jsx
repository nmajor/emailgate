import React, { PropTypes, Component } from 'react';
import CompilationEmailMain from '../components/CompilationEmailMain';
import CompilationEmailMainActions from '../components/CompilationEmailMainActions';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationEmailMainContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);
    this.setEditingSelectedEmail = this.setEditingSelectedEmail.bind(this);

    if (this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(this.props.compilationEmails, { _id: this.props.selectedCompilationEmailId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCompilationEmailId !== this.props.selectedCompilationEmailId) {
      this.selectedCompilationEmail = _.find(nextProps.compilationEmails, { _id: nextProps.selectedCompilationEmailId });
    }
  }
  setEditingSelectedEmail(val) {
    this.props.dispatch(Actions.setEditingSelectedCompilationEmail(val));
  }
  removeEmailFromCompilation(email) {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, email));
  }

  renderCompilationEmailPreviewActions() {
    if (this.selectedCompilationEmail) {
      return (<CompilationEmailMainActions
        email={this.selectedCompilationEmail}
        removeEmail={this.removeEmailFromCompilation}
        setEditing={this.setEditingSelectedEmail}
        editing={this.props.editingSelectedCompilationEmail}
      />);
    }
  }
  renderCompilationEmailPreview() {
    if (this.selectedCompilationEmail) {
      return (<CompilationEmailMain
        email={this.selectedCompilationEmail}
      />);
    }
  }
  render() {
    return (<div>
      {this.renderCompilationEmailPreviewActions()}
      {this.renderCompilationEmailPreview()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    selectedCompilationEmailId: store.selectedCompilationEmailId,
    editingSelectedCompilationEmail: store.editingSelectedCompilationEmail,
  };
}

CompilationEmailMainContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
  editingSelectedCompilationEmail: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(CompilationEmailMainContainer);
