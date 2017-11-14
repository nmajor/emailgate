import React, { PropTypes, Component } from 'react';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import CompilationMessageForm from '../components/CompilationMessageForm';
import MessagePageTemplate from '../templates/book/messagePage';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationMessageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.update = this.update.bind(this);
    this.back = this.back.bind(this);

    this.messagePage = _.find(this.props.compilationPages, { type: 'message-page' });
    this.messagePage.content = this.messagePage.content || {};
  }
  template() {
    return new MessagePageTemplate(this.messagePage);
  }
  update(props) {
    this.props.dispatch(Actions.updateCompilationPageFetch(this.props.compilation._id, this.messagePage, props, (compilation) => {
      this.context.router.push(`/compilations/${compilation._id}/build`);
    }));
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  renderForm() {
    if (this.messagePage) {
      return <CompilationMessageForm page={this.messagePage} submitForm={this.update} fetching={this.messagePage.saving} back={this.back} />;
    }
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div>
          <h1 className="text-center">Edit Message</h1>
          {this.renderForm()}
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
  };
}

CompilationMessageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationMessageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationMessageContainer);
