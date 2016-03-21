import React, { PropTypes, Component } from 'react';
import moment from 'moment';

class EmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.preview = this.preview.bind(this);
  }
  select() {
    this.props.selectEmail(this.props.email);
  }
  unselect() {
    this.props.deselectEmail(this.props.email);
  }
  preview() {
    this.props.setPreviewEmail(this.props.email);
  }
  className() {
    let className = 'emails-list-item';
    className += this.props.previewing ? ' previewing' : '';

    return className;
  }
  renderSelected() {
    if (this.props.disabled) {
      return (
        <span className="selectable selected" onClick={this.unselect}>
          <span className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
        </span>
      );
    } else if (this.props.saving) {
      return (
        <span className="selectable selected" onClick={this.unselect}>
          <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
        </span>
      );
    } else if (this.props.selected) {
      return (
        <span className="selectable selected" onClick={this.unselect}>
          <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
        </span>
      );
    }

    return (
      <span className="selectable unselected" onClick={this.select}>
        <span className="glyphicon glyphicon-unchecked" aria-hidden="true"></span>
      </span>
    );
  }
  render() {
    return (
      <div className="emails-list-item">
        {this.renderSelected()}
        <span className={this.props.previewing ? ' text-primary' : ''} onClick={this.preview}>
          {this.props.email.subject}
          <br />
          <span className="text-muted">{moment(this.props.email.date).format('LL')}</span>
        </span>
      </div>
    );
  }
}

EmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  previewing: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  saving: PropTypes.bool,
  selectEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setPreviewEmail: PropTypes.func.isRequired,
};

export default EmailsListItem;
