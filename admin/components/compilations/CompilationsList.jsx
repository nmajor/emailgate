import React, { PropTypes, Component } from 'react';
import CompilationsListItem from './CompilationsListItem';

class CompilationsList extends Component {
  renderCompilationsList() {
    return this.props.compilations.map((compilation) => {
      return <CompilationsListItem key={compilation._id} compilation={compilation} />;
    });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          {this.renderCompilationsList()}
        </div>
      </div>
    );
  }
}

CompilationsList.propTypes = {
  compilations: PropTypes.array.isRequired,
};

export default CompilationsList;
