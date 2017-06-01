import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component { // eslint-disable-line
  render() {
    return (<div className="padded-box bottom-bumper">
      <Link to={`/compilations/${this.props.compilation._id}`}>{this.props.compilation.title}</Link>
      <div>{this.props.compilation.emails.length} emails</div>
    </div>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
