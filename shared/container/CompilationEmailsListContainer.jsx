import React, { PropTypes, Component } from 'react';
import CompilationEmailsList from '../components/CompilationEmailsList';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

class CompilationEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  renderCompilationEmailsList() {
    if (this.props.fetching.compilationEmails) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return (<CompilationEmailsList
      emails={this.props.compilationEmails}
      currentEmailId={this.props.currentEmailId}
    />);
  }
  render() {
    return (<div>
      {this.renderCompilationEmailsList()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    fetching: store.fetching,
  };
}

CompilationEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentEmailId: PropTypes.string,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationEmailsListContainer);
