import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
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
    }, (pages) => {
      this.hideModal();
      const sortedPages = _.sortBy(pages, (page) => { return page.createdAt; });
      const page = sortedPages[sortedPages.length - 1];
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/pages/${page._id}/edit`);
    }));
  }
  renderThumbOption(type, text, thumb) {
    return (<div className="custom-page-option" onClick={() => { this.addPage(type); }}>
      <div className="bottom-bumper">
        <img role="presentation" src={`/img/page-images/${thumb}`} />
      </div>
      <div className="description">
        {text}
      </div>
    </div>);
  }
  renderModal() {
    if (this.state.showModal) {
      return (<Modal close={this.hideModal}>
        <div className="padded custom-page-options">
          <h3 className="text-center">Please select the type of page you want to add</h3>
          <div className="row bottom-bumper top-bumper">
            <div className="col-xs-6">
              {this.renderThumbOption('message-page', 'Message Page', 'message-page-thumb.jpg')}
            </div>
            <div className="col-xs-6">
              {this.renderThumbOption('full-image-page', 'Full Image Page', 'full-image-page-thumb.jpg')}
            </div>
          </div>
          <div className="text-right actions top-bumper">
            <div onClick={this.hideModal} className="btn btn-danger marginless-right">Back</div>
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

AddCustomPageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};


AddCustomPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  afterObject: PropTypes.object.isRequired,
  afterType: PropTypes.string.isRequired,
  afterId: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(AddCustomPageContainer);
