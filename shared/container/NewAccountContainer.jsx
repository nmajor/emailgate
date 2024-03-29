import React, { PropTypes, Component } from 'react';
// import Header from '../components/Header';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class NewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
    this.redirectToEdit = this.redirectToEdit.bind(this);
  }

  create(props) {
    return new Promise((resolve, reject) => {
      if (props.kind === 'blog') {
        this.props.dispatch(Actions.createAccount({
          email: props.url,
          kind: props.kind,
        }, (response) => {
          if (response.error) {
            return reject({ _error: response.error });
          }

          return resolve();
        }));
      }
    });


    // if (props.kind === 'imap') {
    //   this.props.dispatch(Actions.createAccount({
    //     email: props.email,
    //     kind: props.kind,
    //     authProps: {
    //       host: props.host,
    //       port: props.port,
    //     },
    //   }, (account) => {
    //     this.redirectToEdit(account);
    //     this.props.dispatch(Actions.setPasswordInAccountPasswordMap(account, props.password));
    //   }));
    // }
  }

  redirectToEdit(account) {
    this.context.router.push(`/accounts/${account._id}/edit`);
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="new-account-container">
        <AccountFormContainer new account={{}} submitForm={this.create} back={this.back} />
      </div>
    );
  }
}

NewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NewAccountContainer);
