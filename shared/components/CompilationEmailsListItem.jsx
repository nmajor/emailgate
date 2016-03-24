import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

class CompilationEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderSaving() {
    return (
      <span className="selectable selected">
        <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
      </span>
    );
  }
  renderSelected() {
    return (
      <span className="selectable selected">
        <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
      </span>
    );
  }
  renderIcon() {
    if (this.props.email.saving) {
      return this.renderSaving();
    } else if (this.props.selected) {
      return this.renderSelected();
    }
  }
  render() {
    return (
      <div>
        <span onClick={this.select}>
          {this.renderIcon()}
          <Link to={`/compilations/${this.props.email._compilation}/emails/${this.props.email._id}`} className="emails-list-item bottom-bumper">
            {this.props.email.subject}
          </Link>
          <br />
          <span className="text-muted">{moment(this.props.email.date).format('LL')}</span>
        </span>
      </div>
    );
  }
}

CompilationEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};

export default CompilationEmailsListItem;
