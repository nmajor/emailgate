import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
// import _ from 'lodash';

class AccountBlogForm extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    const {
      fields: {
        url,
      },
      handleSubmit,
      error,
    } = this.props;

    return (<form
      onSubmit={handleSubmit(data => {
        console.log('blah hey data', data);
        this.props.onSubmit({ ...data, kind: 'blog' });
      })}
    >
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="control-label">Blog URL</label>
                <input type="text" className="form-control" {...url} />
                <div className="help-block">Please enter the URL of the blog you want to connect</div>
              </div>
            </div>
          </div>
          <div className="form-group text-right">
            {error && <div className="text-danger">{error}</div>}
            <div>
              <div className="btn btn-danger" onClick={this.props.back}>Back</div>
              <button className="btn btn-success marginless-right" type="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </form>);
  }
}

AccountBlogForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
};

AccountBlogForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'address',
  fields: [
    'url',
  ],
})(AccountBlogForm);

export default AccountBlogForm;
