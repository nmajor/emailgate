import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import RegisterForm from '../components/RegisterForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class RegisterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
  }

  register(email, password) {
    this.props.dispatch(Actions.registerUser({ email, password }));
  }

  render() {
    return (
      <div className="login-container">
        <Header />
        <RegisterForm registerUser={this.register} />
      </div>
    );
  }
}

// function mapStateToProps(store) {
//   return {};
// }

RegisterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(RegisterContainer);
