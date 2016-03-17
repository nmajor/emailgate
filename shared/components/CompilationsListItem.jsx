import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component {
  render() {
    return (
      <div className="compilations-list-item">
        {this.props.compilation.name}
        <Link to={`/compilations/${this.props.compilation._id}/add-emails`}>add emails</Link>
      </div>
    );
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
