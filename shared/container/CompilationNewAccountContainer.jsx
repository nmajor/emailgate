import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import HelperBox from '../components/HelperBox';

class CompilationNewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.back = this.back.bind(this);
    this.create = this.create.bind(this);
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  create() {
    console.log('create function goes here');
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/add-emails`;
  }
  renderHelperBox() {
    const body = (<span>You can remove Missionary Memoir's access to your emails at any time by deleting the email account in your dashboard. We will never use your data for any other purpose than to build your email book. For more info you can read our site <Link to="/terms">terms of use</Link>, or our <Link to="/privacy">privacy policy</Link>.</span>);
    return <HelperBox type="warning" body={body} />;
  }
  renderHeader() {
    if (this.props.accounts.length > 0) {
      return <h3 className="text-center">Connect an email account</h3>;
    }

    return <h3 className="text-center">Connect an email account so you can start adding emails</h3>;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div className="padded">
          {this.renderHeader()}
          {this.renderHelperBox()}
          <AccountFormContainer new account={{}} submitForm={this.create} back={this.back} userReturnTo={this.userReturnTo()} />
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
  };
}

CompilationNewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationNewAccountContainer.propTypes = {
  compilation: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationNewAccountContainer);
