import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WebpageForm from '../components/WebpageForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class NewWebpageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.params.compilationId) {
      this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId }) || {};
    } else {
      this.compilation = {};
    }

    this.submitForm = this.submitForm.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.back = this.back.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId }) || {};
  }
  submitForm(props) {
    return new Promise((resolve) => {
      this.props.dispatch(Actions.updateCompilationFetch(this.compilation._id, props, () => {
        resolve();
      }));
    });
  }
  submitImage(props, cb) {
    this.props.dispatch(Actions.updateCompilationFetch(this.compilation._id, { webpage: { image: props } }, (cb || function () {}))); // eslint-disable-line
  }
  back() {
    this.context.router.goBack();
  }
  render() {
    return (
      <div className="new-compilation-container">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="user-card bottom-bumper">
                <div className="card-body">
                  <h3>New Postcard Page</h3>
                  <WebpageForm compilation={this.compilation} onSubmit={this.submitForm} submitImage={this.submitImage} initialValues={this.compilation} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

NewWebpageContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, { compilationId: params.compilationId }, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    user: store.user,
    compilations: store.compilations,
  };
}

NewWebpageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewWebpageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  compilations: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(NewWebpageContainer);
