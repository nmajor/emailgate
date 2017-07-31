import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CompilationHeader from '../components/CompilationHeader';
import CompilationProgressHeader from '../components/CompilationProgressHeader';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import * as sharedHelpers from '../helpers';
import _ from 'lodash';

class CompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    this.currentCompilationPath = this.getCurrentPath(this.props);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  componentDidMount() {
    if (this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }

    if (this.props.compilations.length < 1) {
      this.props.dispatch(Actions.getCompilations());
    }

    if (this.props.compilationEmails.length < 1) {
      this.props.dispatch(Actions.getCompilationEmails(this.props.params.compilationId));
    }

    if (this.props.compilationPages.length < 1) {
      this.props.dispatch(Actions.getCompilationPages(this.props.params.compilationId));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
    this.currentCompilationPath = this.getCurrentPath(nextProps);
  }
  componentWillUnmount() {
    if (window.previousLocation) {
      this.props.dispatch(Actions.setCompilationEmails([]));
      this.props.dispatch(Actions.setCompilationPages([]));
    }
  }
  getCurrentPath(props) {
    const path = props.routes[props.routes.length - 1].path;
    return path.split('/')[3];
  }
  actionStatusMap() {
    return sharedHelpers.actionStatusMap(this.compilation, this.props.compilationEmails, this.props.compilationPages);
  }
  handleSaveClick() {
    const ReactGA = require('../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Compiilation Save Clicked',
    });
  }
  renderChildren() {
    if (this.props.children && !_.isEmpty(this.compilation)) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation });
      });
    }
  }
  renderSaveNotice() {
    if (this.props.user.isTmp) {
      return (<div className="save-notice">
        <div className="container">
          <span className="right-bumper">Until you register, this book is temporary and could be lost:</span>
          <Link to={`/compilations/${this.compilation._id}/build/register`} className="btn btn-default btn-transparent light" onClick={this.handleSaveClick}><span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Register And Save</Link>
        </div>
      </div>);
    }
  }
  renderCompilation() {
    if (!_.isEmpty(this.compilation)) {
      return (<div className="allheight">
        <Header />
        <CompilationHeader compilation={this.compilation} compilationEmails={this.props.compilationEmails} addingFilteredEmailIds={this.props.addingFilteredEmailIds} />
        <CompilationProgressHeader compilation={this.compilation} currentPath={this.currentCompilationPath} />
        {this.renderSaveNotice()}
        <div className="container-fluid compilation-wrapper">
          {this.renderChildren()}
        </div>
        <Footer />
      </div>);
    }

    return 'Loading Compilation ...';
  }

  render() {
    return (<div className="allheight">
      {this.renderCompilation()}
    </div>);
  }
}

CompilationContainer.need = [
  (params, cookie) => {
    return Actions.getAccounts.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationPages.bind(null, params.compilationId, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilationEmails.bind(null, params.compilationId, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    accounts: store.accounts,
    compilations: store.compilations,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
    addingFilteredEmailIds: store.addingFilteredEmailIds,
    user: store.user,
  };
}

CompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  accounts: PropTypes.array,
  user: PropTypes.object,
  compilations: PropTypes.array,
  compilationEmails: PropTypes.array,
  compilationPages: PropTypes.array,
  addingFilteredEmailIds: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  params: PropTypes.object,
  routes: PropTypes.array,
};

export default connect(mapStateToProps)(CompilationContainer);
