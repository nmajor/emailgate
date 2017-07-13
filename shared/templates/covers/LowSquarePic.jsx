/* eslint react/prop-types: 0 */
/* eslint no-useless-constructor: 0 */
/* eslint react/jsx-first-prop-new-line: 0 */
/* eslint react/jsx-closing-bracket-location: 0 */

import React from 'react';
import CoverBase from './base/CoverBase';
import FrontCoverBase from './base/FrontCoverBase';
import CoverImage from './utils/CoverImage';

class LowSquarePic extends CoverBase {
  constructor(props) {
    props.showBleed = props.showBleed || true;

    super(props);

    this.props.backgroundColor = '#FFF';
    this.props.textColor = '#333';
  }
  defaultImage() {
  }
  renderFrontCover() {
    const {
      compilation,
      prettyStartDate,
      prettyEndDate,
      boardHeightPx,
      boardWidthPx,
      selectImage,
    } = this.props;

    const imageHeight = boardHeightPx * 0.7;
    const imageWidth = boardWidthPx;

    // const defaultImage = {
    //   src: '/img/cover-images/field-standing.jpg',
    //   crop: {
    //     x: 100,
    //     y: 100,
    //     natrualWidth: 1410,
    //     natrualHeight: 1480,
    //     width: imageWidth / 5,
    //     height: imageHeight / 5,
    //   },
    // };

    const coverProps = {
      aspect: (4 / 3),
      metaKey: 'low-square-pic-front',
    };

    return (<FrontCoverBase {...this.props}>
      <div style={{
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1>{compilation.title}</h1>
        <h3>{compilation.subtitle}</h3>
        <h5>{prettyStartDate} - {prettyEndDate}</h5>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        height: imageHeight,
        width: imageWidth,
      }}>
        <CoverImage
          height={imageHeight}
          width={imageWidth}
          selectImage={selectImage}
          coverProp={coverProps}
        />
      </div>
    </FrontCoverBase>);
  }
}

export default LowSquarePic;
