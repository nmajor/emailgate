import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component {
  render() {
    return (
      <div className="compilations-list-item">
        <Link to={`/compilations/${this.props.compilation._id}/emails`}>{this.props.compilation.name}</Link>
      </div>
    );
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
