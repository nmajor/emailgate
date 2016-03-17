import React, { PropTypes, Component } from 'react';

class EmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.preview = this.preview.bind(this);
  }
  select() {
    this.props.addEmailToSelected(this.props.email);
  }
  unselect() {
    this.props.removeEmailFromSelected(this.props.email);
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
    if (this.props.selected) {
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
        </span>
      </div>
    );
  }
}

EmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  previewing: PropTypes.bool,
  selected: PropTypes.bool,
  addEmailToSelected: PropTypes.func.isRequired,
  removeEmailFromSelected: PropTypes.func.isRequired,
  setPreviewEmail: PropTypes.func.isRequired,
};

export default EmailsListItem;
