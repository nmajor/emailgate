import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component {
  render() {
    return (<Link className="compilations-list-item" to={`/compilations/${this.props.compilation._id}/emails`}>
      {this.props.compilation.name}
    </Link>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
