import React, { PropTypes, Component } from 'react';
import CompilationComponentsList from '../components/CompilationComponentsList';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import * as Actions from '../redux/actions/index';

class CompilationComponentsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.rebuildPdf = this.rebuildPdf.bind(this);
    this.reImportEmailBody = this.reImportEmailBody.bind(this);
  }
  reImportEmailBody(id) {
    this.props.dispatch(Actions.reImportEmailBody(id));
  }
  rebuildPdf(type, id) {
    if (type === 'email') {
      this.props.dispatch(Actions.rebuildEmailPdf(id));
    } else if (type === 'page') {
      this.props.dispatch(Actions.rebuildPagePdf(id));
    }
  }
  renderCompilationComponentsList() {
    if (this.props.fetching.compilationEmails || this.props.fetching.compilationPages) {
      return <div className="top-bumper text-center"><span className="alone-loading"><Loading /></span></div>;
    }

    return (<CompilationComponentsList
      compilation={this.props.compilation}
      emails={this.props.compilationEmails}
      pages={this.props.compilationPages}
      currentEmailId={this.props.currentEmailId}
      currentPageId={this.props.currentPageId}
      edit={this.props.edit}
      rotateAttachment={this.props.rotateAttachment}
      componentProps={this.props.componentProps}
      user={this.props.user}
      rebuildPdf={this.rebuildPdf}
      reImportEmailBody={this.reImportEmailBody}
    />);
  }
  render() {
    return this.renderCompilationComponentsList();
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
    fetching: store.fetching,
    user: store.user,
  };
}

CompilationComponentsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  compilationPages: PropTypes.array,
  currentEmailId: PropTypes.string,
  currentPageId: PropTypes.string,
  edit: PropTypes.func,
  rotateAttachment: PropTypes.func,
  componentProps: PropTypes.object,
  fetching: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationComponentsListContainer);
