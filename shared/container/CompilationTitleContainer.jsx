import React, { PropTypes, Component } from 'react';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationTitleContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.update = this.update.bind(this);
    this.back = this.back.bind(this);
  }
  update(props) {
    this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, props, (compilation) => {
      this.context.router.push(`/compilations/${compilation._id}/build`);
    }));
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div>
          <h1 className="text-center">Edit Titles</h1>
          <CompilationTitleForm compilation={this.props.compilation} submitForm={this.update} fetching={this.props.compilation.saving} back={this.back} />
        </div>
      </Modal>
    </div>);
  }
}

CompilationTitleContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationTitleContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(CompilationTitleContainer);
