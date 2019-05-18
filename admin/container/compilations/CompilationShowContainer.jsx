import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationView from '../../components/compilations/CompilationView';
import * as Actions from '../../redux/actions/index';

class CompilationShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.compilePdfs = this.compilePdfs.bind(this);
    this.buildEmailPdfs = this.buildEmailPdfs.bind(this);
    this.buildEmailPdfsDocker = this.buildEmailPdfsDocker.bind(this);
    this.buildCoverPdf = this.buildCoverPdf.bind(this);
    this.submitSpineWidth = this.submitSpineWidth.bind(this);
    this.resaveAllComponents = this.resaveAllComponents.bind(this);
    this.clearCompilationLogs = this.clearCompilationLogs.bind(this);
  }
  buildEmailPdfs() {
    this.props.dispatch(Actions.buildEmailPdfs(this.props.compilation._id));
  }
  buildEmailPdfsDocker() {
    this.props.dispatch(Actions.buildEmailPdfsDocker(this.props.compilation._id));
  }
  compilePdfs() {
    this.props.dispatch(Actions.compilePdfs(this.props.compilation._id));
  }
  buildCoverPdf() {
    this.props.dispatch(Actions.buildCompilationCoverPdf(this.props.compilation._id));
  }
  submitSpineWidth(spineWidth) {
    this.props.dispatch(Actions.updateCompilation(this.props.compilation._id, { cover: { spineWidth } }));
  }
  resaveAllComponents() {
    this.props.dispatch(Actions.resaveAllComponents(this.props.compilation._id));
  }
  clearCompilationLogs() {
    this.props.dispatch(Actions.clearCompilationLogs(this.props.compilation._id));
  }
  render() {
    if (this.props.compilation) {
      return (<div>
        <CompilationView compilation={this.props.compilation} buildEmailPdfsDocker={this.buildEmailPdfsDocker} buildEmailPdfs={this.buildEmailPdfs} compilePdfs={this.compilePdfs} buildCoverPdf={this.buildCoverPdf} submitSpineWidth={this.submitSpineWidth} resaveAllComponents={this.resaveAllComponents} clearCompilationLogs={this.clearCompilationLogs} />
      </div>);
    }

    return <div>Trying to load compilation</div>;
  }
}

CompilationShowContainer.need = [
  // (params, cookie) => {
  //   return Actions.getCompilation.bind(null, cookie)();
  // },
];

function mapStateToProps(state, params) {
  return {
    compilations: _.find(state.compilations, { _id: params.compilationId }),
  };
}

CompilationShowContainer.propTypes = {
  dispatch: PropTypes.func,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationShowContainer);
