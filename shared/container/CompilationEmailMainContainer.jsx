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

    if (this.props.currentCompilationEmailId) {
      this.currentCompilationEmail = _.find(this.props.compilationEmails, { _id: this.props.currentCompilationEmailId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentCompilationEmailId !== this.props.currentCompilationEmailId) {
      this.currentCompilationEmail = _.find(nextProps.compilationEmails, { _id: nextProps.currentCompilationEmailId });
    }
  }
  setEditingSelectedEmail(val) {
    this.props.dispatch(Actions.setEditingCurrentCompilationEmail(val));
  }
  removeEmailFromCompilation(email) {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, email));
  }

  renderCompilationEmailPreviewActions() {
    if (this.currentCompilationEmail) {
      return (<CompilationEmailMainActions
        email={this.currentCompilationEmail}
        removeEmail={this.removeEmailFromCompilation}
        setEditing={this.setEditingSelectedEmail}
        editing={this.props.editingCurrentCompilationEmail}
      />);
    }
  }
  renderCompilationEmailPreview() {
    if (this.currentCompilationEmail) {
      return (<CompilationEmailMain
        email={this.currentCompilationEmail}
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
