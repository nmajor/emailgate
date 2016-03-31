import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta } from '../helpers';

class CompilationPagesListItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderSaving() {
    return (
      <span className="selectable selected">
        <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
      </span>
    );
  }
  renderSelected() {
    return (
      <span className="selectable selected">
        <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
      </span>
    );
  }
  renderIcon() {
    if (this.props.page.saving) {
      return this.renderSaving();
    } else if (this.props.selected) {
      return this.renderSelected();
    }
  }
  render() {
    return (
      <div>
        <span onClick={this.select}>
          {this.renderIcon()}
          <Link to={`/compilations/${this.props.page._compilation}/pages/${this.props.page._id}`} className=" bottom-bumper">
            {pageMeta(this.props.page).desc}
          </Link>
        </span>
      </div>
    );
  }
}

CompilationPagesListItem.propTypes = {
  page: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};

export default CompilationPagesListItem;
