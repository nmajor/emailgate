import React, { PropTypes, Component } from 'react';
import WebpageForm from '../components/WebpageForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
// import _ from 'lodash';

class BuildWebpageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitForm = this.submitForm.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.back = this.back.bind(this);
  }
  submitForm(props) {
    return new Promise((resolve) => {
      this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, props, () => {
        resolve();
      }));
    });
  }
  submitImage(props, cb) {
    this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, { webpage: { image: props } }, (cb || function () {}))); // eslint-disable-line
  }
  back() {
    this.context.router.goBack();
  }
  render() {
    return (<div className="container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="user-card bottom-bumper">
            <div className="card-body">
              <h3>New Postcard Page</h3>
              <WebpageForm compilation={this.props.compilation} onSubmit={this.submitForm} submitImage={this.submitImage} initialValues={this.props.compilation} />
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    compilations: store.compilations,
  };
}

BuildWebpageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

BuildWebpageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BuildWebpageContainer);
