import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/compilations/${this.props.compilation._id}`}>{this.props.compilation.title}</Link>
    </div>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
