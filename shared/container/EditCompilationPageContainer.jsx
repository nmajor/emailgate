import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';
import * as Actions from '../redux/actions/index';
import CoverTemplate from '../templates/cover';
import TitlePageTemplate from '../templates/titlePage';
import MessagePageTemplate from '../templates/messagePage';
import FullImagePageTemplate from '../templates/fullImagePage';

class EditCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.rotateImage = this.rotateImage.bind(this);

    if (this.props.params.pageId) {
      this.currentPage = _.find(this.props.compilationPages, { _id: this.props.params.pageId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pageId) {
      this.currentPage = _.find(nextProps.compilationPages, { _id: nextProps.params.pageId });
    }
  }
  getComponentProps() {
    return {
      templateFactory: this.templateFactory,
      remove: this.remove,
      rotateImage: this.rotateImage,
    };
  }
  rotateImage() {
    this.props.dispatch(Actions.rotateCompilationPageImage(this.props.compilation._id, this.currentPage));
  }
  remove() {
    if (window.confirm('Are you sure you want to delete this page?')) { // eslint-disable-line no-alert
      this.props.dispatch(Actions.removePageFromCompilationPages(this.props.compilation._id, this.currentPage));
      this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
    }
  }
  templateFactory(page, options) {
    if (page) {
      switch (page.type) {
        case 'cover' : {
          return new CoverTemplate(page);
        }
        case 'title-page' : {
          const startDate = this.props.compilation.startingDate;
          const endDate = this.props.compilation.endingDate;
          return new TitlePageTemplate(page, { startDate, endDate, compilation: this.props.compilation });
        }
        case 'message-page' : {
          return new MessagePageTemplate(page);
        }
        case 'full-image-page' : {
          return new FullImagePageTemplate(page, options);
        }
        case 'table-of-contents' : {
          // Cant edit table of contents page
          return null;
        }
        default : {
          return null;
        }
      }
    }
  }
  save(pageProps) {
    this.props.dispatch(Actions.updateCompilationPage(this.props.compilation._id, this.currentPage, pageProps));
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentPage={this.currentPage} edit={this.save} componentProps={this.getComponentProps()} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationPages: store.compilationPages,
    compilationEmails: store.compilationEmails,
  };
}

EditCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationPages: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditCompilationPageContainer);
