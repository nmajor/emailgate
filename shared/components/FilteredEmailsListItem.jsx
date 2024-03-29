import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import EmailView from './EmailView';
import Loading from './Loading';
import twemoji from 'twemoji';

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
  renderShowAction() {
    return (<div className="btn btn-default" onClick={this.preview}>
      <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
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
    let icon = <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>;

    if (this.props.email.source === 'blogger') {
      icon = <span className="fa fa-rss"></span>;
    }

    return (<div className="type">
      {icon} <span className="date">{moment(this.props.email.date).format('LL')}</span> {this.props.disabled ? <span> - Already added to Email Book</span> : ''}
    </div>);
  }
  renderSubject() {
    const subject = this.props.email.subject || 'No subject';
    return <div className="subject" dangerouslySetInnerHTML={{ __html: twemoji.parse(subject) }}></div>;
  }
  renderBodyPreview() {
    return <div>{this.props.email.bodyPreview || 'There is nothing in this email...'}</div>;
  }
  renderEmailThumb() {
    return (<div className={this.className()}>
      <div className="list-item-actions">
        {this.renderShowAction()}
      </div>
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

    return <EmailView email={this.props.email} disabled={this.props.disabled} dontEmbed />;
  }
  renderEmailListItem() {
    if (this.props.previewing) {
      return (<div className="relative">
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
