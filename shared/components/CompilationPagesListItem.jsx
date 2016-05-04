import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta } from '../helpers';
import Loading from './Loading';

class CompilationPagesListItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  className() {
    let className = 'compilation-pages-list-item';
    className += this.props.current ? ' current' : '';

    return className;
  }
  renderSaving() {
    return <span className="icon-loading"><Loading /></span>;
  }
  renderIcon() {
    if (this.props.page.saving) {
      return this.renderSaving();
    }
  }
  render() {
    return (
      <Link className={this.className()} to={`/compilations/${this.props.page._compilation}/pages/${this.props.page._id}`}>
        {this.renderIcon()}
        {pageMeta(this.props.page).desc}
      </Link>
    );
  }
}

CompilationPagesListItem.propTypes = {
  page: PropTypes.object.isRequired,
  current: PropTypes.bool,
};

export default CompilationPagesListItem;
