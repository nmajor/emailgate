import React, { PropTypes, Component } from 'react';
import * as Actions from '../redux/actions/index';
// import { Link } from 'react-router';
import CompilationComponentsListContainer from './CompilationComponentsListContainer';
import ScreencastHelper from '../components/ScreencastHelper';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationBuildContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.openChat = this.openChat.bind(this);
    this.addBlankEmail = this.addBlankEmail.bind(this);
    this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
    this.hideHelp = this.hideHelp.bind(this);
    this.showHelp = this.showHelp.bind(this);

    const setting = _.find(props.config.settings, (s) => { return s.name === 'editCompilationScreencastHelp'; });
    this.screencastUrl = _.get(setting, 'value.videoUrl');
  }
  hideHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showEditHelp: false }));
  }
  showHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showEditHelp: true }));
  }
  openChat() {
    window.open('https://missionarymemoir.freshdesk.com/support/tickets/new');
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
  renderStuckButton() {
    return (
      <div className="btn btn-default" onClick={this.openChat}>Need Help?</div>
    );
  }
  // renderFixedFooter() {
  //   if (!this.props.edit && this.props.ffooter !== false) {
  //     return (<FixedFooter>
  //       <div className="row">
  //         <div className="col-xs-6">
  //           <Link to={`/compilations/${this.props.compilation._id}/add-emails`} className="btn btn-default"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Emails</Link>
  //           {this.renderSaveAction()}
  //         </div>
  //         <div className="col-xs-6 text-right">
  //           {this.renderStuckButton()}
  //           <Link to={`/compilations/${this.props.compilation._id}/post-next`} className="btn btn-success marginless-right" onClick={this.handleCheckoutClick}><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Checkout</Link>
  //         </div>
  //       </div>
  //     </FixedFooter>);
  //   }
  // }
  renderAddBlankAction() {
    return (<div className="btn btn-default btn-xs-true" onClick={this.addBlankEmail}>
      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Blank Email
    </div>);
  }
  renderActions() {
    return (<div className="text-right bottom-bumper">
      {this.renderAddBlankAction()}
    </div>);
  }
  renderScreencastHelper() {
    if (this.screencastUrl) {
      return (<ScreencastHelper videoUrl={this.screencastUrl} hide={this.hideHelp} show={this.showHelp} visible={this.props.user.appState.showEditHelp}>
        <h1>Welcome to the Edit page!</h1>
        <p>Here you can really make your book your own. Edit and change any email. Add new picture attachments to any email. You can even add a custom image or message page!</p>
      </ScreencastHelper>);
    }
  }
  render() {
    return (<div className="container compilation-container">
      {this.renderScreencastHelper()}
      <div className="compilation-content-box">
        <div>
          {this.renderActions()}
          <CompilationComponentsListContainer
            currentEmailId={_.get(this.props.currentEmail, '_id')}
            currentPageId={_.get(this.props.currentPage, '_id')}
            compilation={this.props.compilation}
            edit={this.props.edit}
            rotateAttachment={this.props.rotateAttachment}
            componentProps={this.props.componentProps}
          />
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    config: store.config,
  };
}

CompilationBuildContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationBuildContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object,
  currentPage: PropTypes.object,
  edit: PropTypes.func,
  rotateAttachment: PropTypes.func,
  componentProps: PropTypes.object,
  ffooter: PropTypes.bool,
  params: PropTypes.object,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationBuildContainer);
