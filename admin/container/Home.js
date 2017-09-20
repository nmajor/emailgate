import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DashboardWrapper from './DashboardWrapper';
import * as Actions from '../redux/actions/index';

class Home extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleSuperButtonClick = this.handleSuperButtonClick.bind(this);
  }
  handleSuperButtonClick() {
    this.props.dispatch(Actions.runAdminTask());
  }
  renderSuperButton() {
    if (window && window.location.hostname === 'admin.localhost') {
      return (<div className="btn btn-danger" onClick={this.handleSuperButtonClick}>SUPER BUTTON!</div>);
    }
  }
  render() {
    return (<DashboardWrapper>
      <div>Nothing here yet</div>
      {this.renderSuperButton()}
    </DashboardWrapper>);
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
};

export default connect()(Home);
