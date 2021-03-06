import React, { PropTypes, Component } from 'react';
import CompilationsListItem from './CompilationsListItem';
import { Link } from 'react-router';


class CompilationsList extends Component {
  renderCompilationsList() {
    if (!this.props.compilations.length || this.props.compilations.length < 1) {
      return 'No email books';
    }

    return this.props.compilations.map((compilation) => {
      return <CompilationsListItem key={compilation._id} compilation={compilation} viewable onDeleteClick={this.props.onDeleteClick} />;
    });
  }
  renderNewCompilation() {
    return (<div>
      <Link to="/compilations/new" className="btn btn-default new-compilation" >
        New Email Book
      </Link>
    </div>);
  }
  renderAccountForm() {

  }
  render() {
    return (
      <div className="compilations-list row">
        <div className="col-lg-6">
          {this.renderCompilationsList()}
          {this.renderNewCompilation()}
        </div>
      </div>
    );
  }
}

CompilationsList.propTypes = {
  compilations: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func,
};

export default CompilationsList;
