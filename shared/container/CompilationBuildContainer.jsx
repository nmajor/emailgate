import React, { PropTypes, Component } from 'react';
import * as Actions from '../redux/actions/index';
import { Link } from 'react-router';
import CompilationComponentsListContainer from './CompilationComponentsListContainer';
import { connect } from 'react-redux';
import _ from 'lodash';
import FixedFooter from '../components/FixedFooter';
import { colWrapperClass } from '../helpers';

class CompilationBuildContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.openChat = this.openChat.bind(this);
    this.addBlankEmail = this.addBlankEmail.bind(this);
    this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  openChat() {
    const chatElm = document.getElementById('tawkchat-status-icon');
    if (chatElm) {
      chatElm.click();
    } else {
      window.open('https://tawk.to/chat/591c6a9c76be7313d291d516/default/?$_tawk_popout=true');
    }
  }
  addBlankEmail() {
    this.props.dispatch(Actions.addBlankEmail(this.props.compilation._id, (email) => {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/emails/${email._id}/edit`);
    }));
  }
  handleCheckoutClick() {
    const ReactGA = require('../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Compiilation Checkout Clicked',
    });
  }
  handleSaveClick() {
    const ReactGA = require('../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Compiilation Save Clicked',
    });
  }
  renderSaveAction() {
    if (this.props.user.isTmp) {
      return <Link to={`/compilations/${this.props.compilation._id}/build/register`} className="btn btn-default" onClick={this.handleSaveClick}><span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Finish Later</Link>;
    }
  }
  renderStuckButton() {
    return (
      <div className="btn btn-default" onClick={this.openChat}>Need Help?</div>
    );
  }
  renderFixedFooter() {
    if (!this.props.edit && this.props.ffooter !== false) {
      return (<FixedFooter>
        <div className="row">
          <div className="col-xs-6">
            <Link to={`/compilations/${this.props.compilation._id}/add-emails`} className="btn btn-default"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Emails</Link>
            {this.renderSaveAction()}
          </div>
          <div className="col-xs-6 text-right">
            {this.renderStuckButton()}
            <Link to={`/compilations/${this.props.compilation._id}/post-next`} className="btn btn-success marginless-right" onClick={this.handleCheckoutClick}><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Checkout</Link>
          </div>
        </div>
      </FixedFooter>);
    }
  }
  renderAddBlankAction() {
    return (<div className="btn btn-default btn-xs-true" onClick={this.addBlankEmail}>
      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Blank Email
    </div>);
  }
  render() {
    return (<div className="row">
      <div className={colWrapperClass()}>
        <div className="text-right">
          {this.renderAddBlankAction()}
        </div>
        <CompilationComponentsListContainer
          currentEmailId={_.get(this.props.currentEmail, '_id')}
          currentPageId={_.get(this.props.currentPage, '_id')}
          compilation={this.props.compilation}
          edit={this.props.edit}
          componentProps={this.props.componentProps}
        />
      </div>
      {this.renderFixedFooter()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

CompilationBuildContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationBuildContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object,
  currentPage: PropTypes.object,
  edit: PropTypes.func,
  componentProps: PropTypes.object,
  ffooter: PropTypes.bool,
  params: PropTypes.object,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationBuildContainer);
