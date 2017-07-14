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
  renderFrontCover() {
    const {
      compilation,
      prettyStartDate,
      prettyEndDate,
      // boardHeightPx,
      boardWidthPx,
      selectImage,
    } = this.props;

    const aspect = (9 / 10);

    const imageWidth = boardWidthPx;
    const imageHeight = boardWidthPx * (1 / aspect);
    // Have to flip the aspect ratio because we want the longer length to be the
    // height and aspect ratios always have the width as the first number

    const defaultImage = {
      src: '/img/cover-images/field-standing.jpg',
      crop: {
        x: 100,
        y: 100,
        natrualWidth: 1410,
        natrualHeight: 1480,
        width: imageWidth / 5,
        height: imageHeight / 5,
      },
    };

    const coverProps = {
      aspect,
      key: 'low-square-pic-front',
      defaultImage,
    };

    return (<FrontCoverBase {...this.props}>
      <div style={{
        padding: '20px',
        textAlign: 'left',
        textTransform: 'uppercase',
        fontWeight: '400',
        letterSpacing: '2px',
      }}>
        <div style={{
          height: '115px',
          position: 'relative',
          letterSpacing: '6px',
          fontWeight: '500',
          fontSize: '40px',
        }}>
          <span style={{ position: 'absolute', bottom: 0 }}>{compilation.title}</span>
        </div>
        <hr style={{ margin: '10px 0', borderColor: '#EEE' }} />
        <div style={{
          fontSize: '12px',
        }}>{compilation.subtitle}</div>
        <div style={{
          fontSize: '12px',
        }}>{prettyStartDate} - {prettyEndDate}</div>
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
          coverProps={coverProps}
          compilation={compilation}
        />
      </div>
    </FrontCoverBase>);
  }
}

export default LowSquarePic;
