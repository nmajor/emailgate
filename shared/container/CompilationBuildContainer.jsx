import React, { PropTypes, Component } from 'react';
import CompilationComponentsListContainer from './CompilationComponentsListContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class CompilationBuildContainer extends Component {
  renderChildren() {
    if (this.props.children) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          compilation: this.props.compilation,
          currentEmail: this.props.currentEmail,
          currentPage: this.props.currentPage,
        });
      });
    }
  }
  renderListBumper() {
    if (this.props.currentEmail || this.props.currentPage) {
      return <div className="list-bumper"></div>;
    }
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-3 col-md-3">
            <CompilationComponentsListContainer
              currentEmailId={_.get(this.props.currentEmail, '_id')}
              currentPageId={_.get(this.props.currentPage, '_id')}
              compilation={this.props.compilation}
            />
          </div>
          <div className="col-sm-9 col-md-9">
            {this.renderChildren()}
          </div>
        </div>
      </div>
    );
  }
}

CompilationBuildContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationBuildContainer.propTypes = {
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object,
  currentPage: PropTypes.object,
  params: PropTypes.object,
};

export default connect()(CompilationBuildContainer);
