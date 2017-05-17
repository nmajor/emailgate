import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import EmailView from './EmailView';
import Loading from './Loading';

class FilteredEmailsListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.add = this.add.bind(this);
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.preview = this.preview.bind(this);
    this.unpreview = this.unpreview.bind(this);
  }
  add() {
    if (this.props.email.id) {
      this.props.addEmail(this.props.email);
    }
  }
  select() {
    if (this.props.email.mid) {
      this.props.selectEmail(this.props.email);
    }
  }
  deselect() {
    this.props.deselectEmail(this.props.email);
  }
  preview() {
    if (this.props.email.mid) {
      this.props.setCurrentFilteredEmail(this.props.email);
    }
  }
  unpreview() {
    this.props.setCurrentFilteredEmail({});
  }
  className() {
    let className = 'filtered-emails-list-item list-item';
    className += this.props.previewing ? ' previewing' : '';
    className += this.props.disabled ? ' disabled' : '';

    return className;
  }
  renderHideAction() {
    return (<div className="btn btn-default" onClick={this.unpreview}>
      <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
    </div>);
  }
  renderAddAction() {
    if (this.props.disabled) {
      return (<div className="btn btn-success disabled">
        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
      </div>);
    } else if (this.props.email.saving) {
      return (<div className="btn btn-success disabled">
        <span className="icon-loading"><Loading /></span>
      </div>);
    }

    return (<div className="btn btn-success" onClick={this.add}>
      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
    </div>);
  }
  renderAddButton() {
    if (!this.props.disabled && !this.props.selected && !this.props.email.saving) {
      return (<span className="btn btn-success" onClick={this.add}>
        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
      </span>);
    }
  }
  renderCheckbox() {
    if (this.props.email.saving) {
      return <span className="icon-loading"><Loading /></span>;
    } else if (this.props.disabled) {
      return (<span className="my-checkbox disabled">
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </span>);
    } else if (this.props.selected) {
      return (<span className="my-checkbox checked" onClick={this.deselect}>
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </span>);
    }

    return (<span className="my-checkbox" onClick={this.select}></span>);
  }
  renderDate() {
    return (<div className="type">
      <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span className="date">{moment(this.props.email.date).format('LL')}</span> {this.props.disabled ? <span> - Already added to Email Book</span> : ''}
    </div>);
  }
  renderSubject() {
    return <div className="subject">{this.props.email.subject || 'No subject'}</div>;
  }
  renderBodyPreview() {
    return <div>{this.props.email.bodyPreview || 'There is nothing in this email...'}</div>;
  }
  renderEmailThumb() {
    return (<div className={this.className()}>
      <div className="filtered-email-actions">
        <div className="select-email">
          {this.renderCheckbox()}
        </div>
        <div className="add-email-now">
          {this.renderAddButton()}
        </div>
      </div>
      <div className="email-thumb-main" onClick={this.preview}>
        {this.renderDate()}
        {this.renderSubject()}
        {this.renderBodyPreview()}
      </div>
    </div>);
  }
  renderEmailView() {
    if (this.props.email.fetching) {
      return (<div className={this.className()}>
        <div className="email-fetching text-center"><span className="outside-button-loading"><Loading /></span> loading...</div>
      </div>);
    }

    return <EmailView email={this.props.email} disabled={this.props.disabled} />;
  }
  renderEmailListItem() {
    if (this.props.previewing) {
      return (<div>
        <div className="list-item-actions">
          {this.renderAddAction()}
          {this.renderHideAction()}
        </div>
        {this.renderEmailView()}
      </div>);
    }

    return this.renderEmailThumb();
  }
  render() {
    return this.renderEmailListItem();
  }
}

FilteredEmailsListItem.propTypes = {
  email: PropTypes.object.isRequired,
  previewing: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  selectEmail: PropTypes.func.isRequired,
  addEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setCurrentFilteredEmail: PropTypes.func.isRequired,
};

export default FilteredEmailsListItem;
