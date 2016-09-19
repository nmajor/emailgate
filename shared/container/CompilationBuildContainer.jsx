import React, { PropTypes, Component } from 'react';
import CompilationComponentsListContainer from './CompilationComponentsListContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationBuildContainer extends Component { // eslint-disable-line react/prefer-stateless-function
  renderDefaultFooterContent() {
    return (<div>
      <div className="btn btn-success">Add Emails</div>
    </div>);
  }
  renderEditFooterContent() {
    return (<div>
      <div className="btn btn-success">Save</div>
    </div>);
  }
  renderFooterContent() {
    if (this.props.edit) {
      return this.renderEditFooterContent();
    }

    return this.renderDefaultFooterContent();
  }
  renderFixedFooter() {
    return (<div className="compilation-footer container">
      <div className="row">
        <div className="col-sm-12">
          {this.renderFooterContent()}
        </div>
      </div>
    </div>);
  }
  render() {
    console.log(this.props.compilation);
    return (<div className="row">
      <div className="col-sm-12">
        <CompilationComponentsListContainer
          currentEmailId={_.get(this.props.currentEmail, '_id')}
          currentPageId={_.get(this.props.currentPage, '_id')}
          compilation={this.props.compilation}
          edit={this.props.edit}
        />
      </div>
      {this.renderFixedFooter()}
    </div>);
  }
}

CompilationBuildContainer.propTypes = {
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object,
  currentPage: PropTypes.object,
  edit: PropTypes.func,
  params: PropTypes.object,
};

export default connect()(CompilationBuildContainer);
