import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationNav from '../components/CompilationNav';
import CompilationHeader from '../components/CompilationHeader';
import CompilationPdf from '../components/CompilationPdf';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  componentDidMount() {
    this.props.dispatch(Actions.getCompilationPdf(this.props.params.compilationId));
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />

        <CompilationHeader compilation={this.compilation} />
        <CompilationNav compilationId={this.props.params.compilationId} currentPage="preview" />
        <div className="container">
          <h1>Compilation Preview</h1>
          <div className="row">
            <div className="col-md-12">
              <CompilationPdf compilation={this.compilation} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CompilationPreviewContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
  };
}

CompilationPreviewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilations: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPreviewContainer);
