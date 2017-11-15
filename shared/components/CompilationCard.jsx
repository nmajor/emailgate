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
  renderInfo() {
    const { compilation } = this.props;
    const pagesCount = compilationTotalPageCountEstimate(compilation);

    return (<div className="actions">
      <span className="right-bumper"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span> {this.props.compilation.emails.length}</span>
      <span className="right-bumper"><span className="glyphicon glyphicon-file" aria-hidden="true"></span> {pagesCount}</span>
    </div>);
  }
  renderActions() {
    return (<div className="actions">
      <CartCompilationButtonContainer compilation={this.props.compilation} />
      {this.renderViewAction()}
      {this.renderDeleteAction()}
    </div>);
  }
  renderBookInfo() {
    return (<div className="compilation-cart-card">
      <div>
        <div className="compilation-thumb">
          <CompilationThumb compilation={this.props.compilation} />
        </div>
        <div className="details">
          <h3>{this.props.compilation.title}</h3>
          <h5>{this.props.compilation.subtitle}</h5>
          {this.renderInfo()}
        </div>
      </div>
      {this.renderActions()}
    </div>);
  }
  renderPageInfo() {
    const { compilation } = this.props;
    let text = 'Create a Page or Blog'
    if (compilation.slug) { text = 'View Page or blog' }

    return (<div className="page-card">
      <Link to={`/compilations/${compilation._id}/webpage/build`} className="btn btn-default">{text}</Link>
    </div>);
  }
  render() {
    return (<div className="row bottom-bumper">
      <div className="col-xs-12">
        <div className="content-box">
          <div className="row">
            <div className="col-md-6">
              {this.renderBookInfo()}
            </div>
            <div className="col-md-6">
              {this.renderPageInfo()}
            </div>
          </div>
        </div>
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
