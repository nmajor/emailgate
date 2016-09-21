import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta } from '../helpers';
import CompilationPageView from './CompilationPageView';
import CompilationPageForm from './CompilationPageForm';

class CompilationPagesListItem extends Component {
  renderHideAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build`}>
      <span className="glyphicon glyphicon-collapse-up" aria-hidden="true"></span>
    </Link>);
  }
  renderEditAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build/emails/${this.props.page._id}/edit`}>
      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
    </Link>);
  }
  renderViewAction() {
    return (<Link className="btn btn-default" to={`/compilations/${this.props.page._compilation}/build/emails/${this.props.page._id}`}>
      <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
    </Link>);
  }
  renderPageThumb() {
    return (<Link className="compilation-pages-list-item list-item" to={`/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`}>
      <div className="type">
        <span className="glyphicon glyphicon-file" aria-hidden="true"></span> Page
      </div>
      {pageMeta(this.props.page).desc}
    </Link>);
  }
  renderPageListItem() {
    if (this.props.show === 'view') {
      return (<div>
        <div className="list-item-actions">
          {this.renderEditAction()}
          {this.renderHideAction()}
        </div>
        <CompilationPageView page={this.props.page} />
      </div>);
    } else if (this.props.show === 'edit') {
      return (<div>
        <div className="list-item-actions">
          {this.renderViewAction()}
          {this.renderHideAction()}
        </div>
        <CompilationPageForm page={this.props.page} submitForm={this.props.edit} />
      </div>);
    }

    return this.renderPageThumb();
  }
  render() {
    return this.renderPageListItem();
  }
}

CompilationPagesListItem.propTypes = {
  page: PropTypes.object.isRequired,
  show: PropTypes.string,
  edit: PropTypes.func,
};

export default CompilationPagesListItem;
