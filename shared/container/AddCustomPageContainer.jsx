import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import Modal from '../components/Modal';
import AddCustomPage from '../components/AddCustomPage';

class AddCustomPageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
    };

    this.addPage = this.addPage.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  hideModal() {
    this.setState({ showModal: false });
  }
  showModal() {
    this.setState({ showModal: true });
  }
  addPage(type) {
    const { afterId, afterType } = this.props;

    this.props.dispatch(Actions.addCustomPage(this.props.compilation._id, {
      type,
      afterType,
      afterId,
    }));
  }
  renderModal() {
    if (this.state.showModal) {
      return (<Modal close={this.hideModal}>
        <div className="padded">
          <div className="row">
            <div className="col-md-6">
              <div className="custom-page-option" onClick={() => { this.addPage('message'); }}>
                Message Page
              </div>
            </div>
            <div className="col-md-6">
              <div className="custom-page-option" onClick={() => { this.addPage('image'); }}>
                Image Page
              </div>
            </div>
          </div>
          <div className="text-right actions">
            <div onClick={this.hideModal} className="btn btn-danger">Back</div>
          </div>
        </div>
      </Modal>);
    }
  }
  render() {
    return (<div>
      {this.renderModal()}
      <AddCustomPage add={this.showModal} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    fetching: store.fetching,
  };
}

AddCustomPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  afterObject: PropTypes.object.isRequired,
  afterType: PropTypes.string.isRequired,
  afterId: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(AddCustomPageContainer);
