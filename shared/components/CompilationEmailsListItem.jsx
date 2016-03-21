import React, { PropTypes, Component } from 'react';
import moment from 'moment';

class CompilationEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.select = this.select.bind(this);
  }
  select() {
    this.props.selectEmail(this.props.email);
  }
  render() {
    return (
      <div className="emails-list-item">
        <span onClick={this.select} className={`${this.props.selected ? 'text-success' : ''}`}>
          {this.props.email.subject}
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
  selectEmail: PropTypes.func.isRequired,
};

export default CompilationEmailsListItem;
