import React, { PropTypes, Component } from 'react';
import CompilationComponentsList from '../components/CompilationComponentsList';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

class CompilationComponentsListContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  renderCompilationComponentsList() {
    if (this.props.fetching.compilationEmails || this.props.fetching.compilationPages) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return (<CompilationComponentsList
      compilation={this.props.compilation}
      emails={this.props.compilationEmails}
      pages={this.props.compilationPages}
      currentEmailId={this.props.currentEmailId}
      currentPageId={this.props.currentPageId}
    />);
  }
  render() {
    return (<div>
      {this.renderCompilationComponentsList()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
    fetching: store.fetching,
  };
}

CompilationComponentsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  compilationPages: PropTypes.array,
  currentEmailId: PropTypes.string,
  currentPageId: PropTypes.string,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationComponentsListContainer);
