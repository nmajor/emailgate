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
  submitForm() {}
  submitImage(props) {
    this.props.dispatch(Actions.addWebpageImage(props));
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
                  <WebpageForm compilation={this.compilation} submitForm={this.submitForm} submitImage={this.submitImage} />
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
