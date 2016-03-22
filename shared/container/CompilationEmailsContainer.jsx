import React, { PropTypes, Component } from 'react';
import CompilationEmailsListContainer from './CompilationEmailsListContainer';
import CompilationEmailMainContainer from './CompilationEmailMainContainer';
import { connect } from 'react-redux';

class CompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-3">
          <CompilationEmailsListContainer compilation={this.props.compilation} />
        </div>
        <div className="col-md-9">
          <CompilationEmailMainContainer compilation={this.props.compilation} />
        </div>
      </div>
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

CompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  selectedCompilationEmailId: PropTypes.string,
  editingSelectedCompilationEmail: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(CompilationEmailsContainer);
