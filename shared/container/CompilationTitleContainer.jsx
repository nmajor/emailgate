import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import ScreencastHelper from '../components/ScreencastHelper';

class CompilationTitleContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.update = this.update.bind(this);
    this.hideHelp = this.hideHelp.bind(this);
    this.showHelp = this.showHelp.bind(this);
    // this.addImage = this.addImage.bind(this);

    const setting = _.find(props.config.settings, (s) => { return s.name === 'designCoverScreencastHelp'; });
    this.screencastUrl = _.get(setting, 'value.videoUrl');
  }
  update(props) {
    this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, props, () => {}));
  }
  hideHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showCoverHelp: false }));
  }
  showHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showCoverHelp: true }));
  }
  // addImage(props) {
  //   this.props.dispatch(Actions.addCompilationImage(this.props.compilation._id, props, () => {}));
  // }
  renderScreencastHelper() {
    if (this.screencastUrl) {
      return (<ScreencastHelper videoUrl={this.screencastUrl} hide={this.hideHelp} show={this.showHelp} visible={this.props.user.appState.showCoverHelp}>
        <h1>Welcome to the Design Cover page!</h1>
        <p>In this page you can customize your cover! Make it unique and one of a kind. Select from several cover templates. Change the title, text, and images on any cover.</p>
      </ScreencastHelper>);
    }
  }
  render() {
    return (<div className="container compilation-container">
      {this.renderScreencastHelper()}
      <div className="compilation-content-box">
        <h1 className="text-center">Design Cover</h1>
        <CompilationTitleForm compilation={this.props.compilation} submitForm={this.update} fetching={this.props.compilation.saving} />
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    user: store.user,
    compilationEmails: store.compilationEmails,
  };
}

CompilationTitleContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationTitleContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
  user: PropTypes.object,
  config: PropTypes.object,
  compilationEmails: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationTitleContainer);
