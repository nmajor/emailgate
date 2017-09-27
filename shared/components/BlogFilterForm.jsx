import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';
// import _ from 'lodash';

class BlogFilterForm extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderSubmitting() {
    if (this.props.submitting) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderError() {
    if (this.props.error) {
      return (<div>
        <div className="text-danger bottom-bumper">{this.props.error}</div>
      </div>);
    }
  }
  render() {
    const {
      fields: {}, // eslint-disable-line
      handleSubmit,
    } = this.props;

    return (<form
      onSubmit={handleSubmit}
    >
      <div className="row">
        <div className="col-md-12">
          <div className="form-group text-right">
            {this.renderError()}
            <div className="text-right">
              <button className="btn btn-success marginless-right" type="submit">Find Posts {this.renderSubmitting()}</button>
            </div>
          </div>
        </div>
      </div>
    </form>);
  }
}

BlogFilterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

BlogFilterForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'blogFilter',
  fields: [],
})(BlogFilterForm);

export default BlogFilterForm;
