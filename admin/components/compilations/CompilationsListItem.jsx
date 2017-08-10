import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component { // eslint-disable-line
  render() {
    return (<div className="compilation-cart-card content-box bottom-bumper">
      <div className="compilation-thumb">
        <img role="presentation" src={this.props.compilation.thumbnail.url} />
      </div>
      <div className="details">
        <Link to={`/compilations/${this.props.compilation._id}`}>{this.props.compilation.title}</Link>
        <div>{this.props.compilation.emails.length} emails</div>
        <div>Created By: <Link to={`/users/${this.props.compilation._user._id}`}>{this.props.compilation._user.name}</Link> - {this.props.compilation._user.email}</div>
      </div>
    </div>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
