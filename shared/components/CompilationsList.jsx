import React, { PropTypes, Component } from 'react';
import CompilationsListItem from './CompilationsListItem';
import { Link } from 'react-router';


class CompilationsList extends Component {
  renderCompilationsList() {
    if (!this.props.compilations.length || this.props.compilations.length < 1) {
      return 'No compilations';
    }

    return this.props.compilations.map((compilation) => {
      return <CompilationsListItem key={compilation._id} compilation={compilation} />;
    });
  }
  renderNewCompilation() {
    return (
      <Link to="/compilations/new" className="btn btn-default new-compilation" >
        New Compilation
      </Link>
    );
  }
  renderAccountForm() {

  }
  render() {
    return (
      <div className="compilations-list">
        {this.renderCompilationsList()}
        {this.renderNewCompilation()}
      </div>
    );
  }
}

CompilationsList.propTypes = {
  compilations: PropTypes.array.isRequired,
};

export default CompilationsList;
