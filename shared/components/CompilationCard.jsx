import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { compilationTotalPageCountEstimate } from '../helpers';
import CompilationThumb from './CompilationThumb';
import CartCompilationButtonContainer from '../container/CartCompilationButtonContainer';

class CompilationCard extends Component { // eslint-disable-line
  renderDeleteAction() {
    const { compilation } = this.props;

    if (this.props.onDeleteClick) {
      return (<div className="btn btn-danger" onClick={() => { this.props.onDeleteClick(compilation._id); }}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></div>);
    }
  }
  renderViewAction() {
    const { compilation } = this.props;

    if (this.props.viewable) {
      return (<Link className="btn btn-primary" to={`/compilations/${compilation._id}/pre-next`}><span className="glyphicon glyphicon-eye-open right-bumper" aria-hidden="true"></span>View</Link>);
    }
  }
  renderInfoActions() {
    const { compilation } = this.props;
    const pagesCount = compilationTotalPageCountEstimate(compilation);

    return (<div className="actions">
      <span className="label label-default right-bumper"><span className="glyphicon glyphicon-envelope right-bumper" aria-hidden="true"></span>{this.props.compilation.emails.length}</span>
      <span className="label label-default right-bumper"><span className="glyphicon glyphicon-file right-bumper" aria-hidden="true"></span>{pagesCount}</span>
      <CartCompilationButtonContainer compilation={this.props.compilation} />
      {this.renderViewAction()}
      {this.renderDeleteAction()}
    </div>);
  }
  render() {
    return (<div className="compilation-cart-card content-box bottom-bumper">
      <div className="compilation-thumb">
        <CompilationThumb compilation={this.props.compilation} />
      </div>
      <div className="details">
        <h3>{this.props.compilation.title}</h3>
        <h5>{this.props.compilation.subtitle}</h5>
        {this.renderInfoActions()}
      </div>
    </div>);
  }
}

CompilationCard.propTypes = {
  compilation: PropTypes.object.isRequired,
  viewable: PropTypes.bool,
  onDeleteClick: PropTypes.func,
};

export default CompilationCard;
