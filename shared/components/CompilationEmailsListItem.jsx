import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

class CompilationEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderSaving() {
    if (this.props.email.saving) {
      return (
        <span className="selectable selected">
          <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
        </span>
      );
    }
  }
  render() {
    return (
      <div>
        <span onClick={this.select} className={`${this.props.selected ? 'text-success' : ''}`}>
          {this.renderSaving()}
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
