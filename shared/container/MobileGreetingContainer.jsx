import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { clientIsMobile } from '../helpers';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class MobileGreetingContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.hideMessage = this.hideMessage.bind(this);
  }
  componentWillMount() {
    this.clientIsMobile = clientIsMobile();
  }
  hideMessage() {
    this.props.dispatch(Actions.updateUserAppState({ showMobileGreeting: false }));
  }
  render() {
    if (this.clientIsMobile && _.get(this.props.user, 'appState.showMobileGreeting')) {
      return (<div className="container top-bumper bottom-bumper">
        <div className="content-box mobile-greeting">
          <div className="actions">
            <div className="btn btn-default marginless-right" onClick={this.hideMessage}>close</div>
          </div>
          <h1 className="marginless-top"><span className="glyphicon glyphicon-phone"></span> Hello!</h1>
          <p>I looks like you are using a mobile device! Our site works best on desktop computers, but you should still be able to do a lot with your phone.</p>
          <p>If you have any problems or questions please <a href="https://missionarymemoir.freshdesk.com/support/tickets/new">Contact Us</a>.</p>
        </div>
      </div>);
    }

    return <div></div>;
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    user: store.user,
    compilationEmails: store.compilationEmails,
  };
}

MobileGreetingContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(MobileGreetingContainer);
