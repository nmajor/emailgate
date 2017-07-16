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

    this.props.backgroundColor = '#333';
    this.props.textColor = '#FFF';
  }
  renderFrontCover() {
    const {
      compilation,
      prettyStartDate,
      prettyEndDate,
      boardHeightPx,
      boardWidthPx,
      boardHeight,
      boardWidth,
      selectImage,
    } = this.props;

    const aspect = (boardWidthPx / boardHeightPx);

    const imageWidth = boardWidthPx;
    const imageHeight = boardHeightPx;

    const defaultImage = {
      url: '/img/cover-images/field-standing.jpg',
      crop: {
        height: 911,
        naturalHeight: 945,
        naturalWidth: 900,
        width: 573,
        x: 150,
        y: 34,
      },
    };

    const coverProps = {
      aspect,
      key: 'full-image-overlay-front',
      defaultImage,
    };

    return (<FrontCoverBase {...this.props}>
      <div className="1" style={{
        position: 'absolute',
        top: 0,
        height: boardHeight,
        width: boardWidth,
        opacity: 0.6,
      }}>
        <CoverImage
          height={imageHeight}
          width={imageWidth}
          selectImage={selectImage}
          coverProps={coverProps}
          compilation={compilation}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: 40,
        fontSize: '35px',
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '100%',
        padding: '0 40px',
      }}>{compilation.title}</div>
      <div style={{
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
        padding: '0 40px',
        width: '100%',
      }}>
        <div style={{
          fontSize: '25px',
          fontWeight: '400',
        }}>{compilation.subtitle}</div>
        <div style={{
          fontSize: '25px',
          fontWeight: '300',
        }}>{prettyStartDate} - {prettyEndDate}</div>
      </div>
    </FrontCoverBase>);
  }
}

export default LowSquarePic;
