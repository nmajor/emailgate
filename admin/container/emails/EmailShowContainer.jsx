import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../../redux/actions/index';
import EmailView from '../../components/emails/EmailView';

class EmailShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.props.dispatch(Actions.getEmail(this.props.params.emailId));
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setEmail({}));
  }
  renderEmail() {
    if (!_.isEmpty(this.props.email)) {
      return <EmailView email={this.props.email} />;
    }
  }
  render() {
    return <div>{this.renderEmail()}</div>;
  }
}

function mapStateToProps(store) {
  return {
    email: store.email,
  };
}

EmailShowContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(EmailShowContainer);
