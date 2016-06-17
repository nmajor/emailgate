import React, { PropTypes, Component } from 'react';
import Loading from './Loading';
import moment from 'moment';

class FilteredEmailsListItem extends Component {
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
    this.props.setCurrentFilteredEmail(this.props.email);
  }
  className() {
    let className = 'filtered-emails-list-item list-item';
    className += this.props.previewing ? ' previewing' : '';
    className += this.props.disabled ? ' disabled' : '';

    return className;
  }
  renderSelected() {
    if (this.props.saving) {
      return (
        <span className="selectable selected">
          <Loading />
        </span>
      );
    } else if (this.props.disabled) {
      return null;
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
      <div className={this.className()} onClick={this.preview}>
        <div>
          <span className="selected-icon">{this.renderSelected()}</span>
          {this.props.email.subject}
        </div>
        <div className="date">
          {moment(this.props.email.date).format('LL')}
        </div>
      </div>
    );
  }
}

FilteredEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  previewing: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  saving: PropTypes.bool,
  selectEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setCurrentFilteredEmail: PropTypes.func.isRequired,
};

export default FilteredEmailsListItem;
