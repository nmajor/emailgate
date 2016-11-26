import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../../redux/actions/index';
import PageView from '../../components/pages/PageView';

class PageShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.props.dispatch(Actions.getPage(this.props.params.pageId));
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPage({}));
  }
  renderEmail() {
    if (!_.isEmpty(this.props.page)) {
      return <PageView page={this.props.page} />;
    }
  }
  render() {
    return <div>{this.renderEmail()}</div>;
  }
}

function mapStateToProps(store) {
  return {
    page: store.page,
  };
}

PageShowContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PageShowContainer);
