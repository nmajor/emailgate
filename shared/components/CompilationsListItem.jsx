import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationListItem extends Component {
  render() {
    return (
      <div className="compilation-list-item">
        {this.props.compilation.name} <Link to={`/compilations/${this.props.compilation._id}/edit`}>edit</Link>
      </div>
    );
  }
}

CompilationListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationListItem;
