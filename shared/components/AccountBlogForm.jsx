import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import Loading from './Loading';
// import _ from 'lodash';

class AccountBlogForm extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  componentDidMount() {
    this.props.initializeForm({
      kind: 'blog',
    });
  }
  renderSubmitting() {
    if (this.props.submitting) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderError() {
    if (this.props.error) {
      return (<div>
        <div className="text-danger bottom-bumper">{this.props.error}</div>
        <div className="text-left helper-box alert alert-danger">
          <p>
            Blogs are imported using <a href="https://en.wikipedia.org/wiki/RSS">rss feeds</a> which are ways to get only the text and images of a blog.
          </p>
          <p>
            You are seeing this error because our app could not find or access the RSS feed for the URL you entered.
          </p>
          <h3 className="top-bumper">Try these 2 things:</h3>
          <div className="col-xs-12">
            <ul>
              <li>Double check that the URL is correct.</li>
              <li>Make sure the blog is public. At this time our app can only access blogs that are publicly viewable</li>
            </ul>
          </div>
          <p>
            Please <a href="https://missionarymemoir.freshdesk.com/support/tickets/new">contact us</a> if you are still having trouble.
          </p>
        </div>
      </div>);
    }
  }
  render() {
    const {
      fields: {
        url,
      },
      handleSubmit,
    } = this.props;

    return (<form
      onSubmit={handleSubmit}
    >
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="control-label">Blog URL</label>
                <input type="text" className="form-control" {...url} />
                <div className="help-block">
                  <div>Please enter the URL of the blog you want to connect</div>
                  <div>example: eldersmithmission.blogspot.com</div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group text-right">
            {this.renderError()}
            <div>
              <div className="btn btn-danger" onClick={this.props.back}>Back</div>
              <button className="btn btn-success marginless-right" type="submit">Submit {this.renderSubmitting()}</button>
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
  initializeForm: PropTypes.func.isRequired,
};

AccountBlogForm = reduxForm({ // eslint-disable-line no-class-assign
  form: 'address',
  fields: [
    'url',
    'kind',
  ],
})(AccountBlogForm);

export default AccountBlogForm;
