import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import CompilationComponentsListContainer from './CompilationComponentsListContainer';
import { connect } from 'react-redux';
import _ from 'lodash';
import FixedFooter from '../components/FixedFooter';

class CompilationBuildContainer extends Component { // eslint-disable-line react/prefer-stateless-function
  renderFixedFooter() {
    if (!this.props.edit && this.props.ffooter !== false) {
      return (<FixedFooter>
        <Link to={`/compilations/${this.props.compilation._id}/build/add-emails`} className="btn btn-success">Add Emails</Link>
        <Link to={`/compilations/${this.props.compilation._id}/checkout`} className="btn btn-success">Checkout</Link>
      </FixedFooter>);
    }
  }
  render() {
    return (<div className="row">
      <div className="col-md-6 col-md-offset-3">
        <CompilationComponentsListContainer
          currentEmailId={_.get(this.props.currentEmail, '_id')}
          currentPageId={_.get(this.props.currentPage, '_id')}
          compilation={this.props.compilation}
          edit={this.props.edit}
          componentProps={this.props.componentProps}
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
  componentProps: PropTypes.object,
  ffooter: PropTypes.bool,
  params: PropTypes.object,
};

export default connect()(CompilationBuildContainer);
