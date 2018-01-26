import classnames from 'classnames';
import {FormattedDate, FormattedMessage, FormattedNumber} from 'react-intl';
import React from 'react';

import CalendarCreatedIcon from '../icons/CalendarCreatedIcon';
import CalendarIcon from '../icons/CalendarIcon';
import Checkmark from '../icons/Checkmark';
import ClockIcon from '../icons/ClockIcon';
import CommentIcon from '../icons/CommentIcon';
import DetailNotAvailableIcon from '../icons/DetailNotAvailableIcon';
import DiskIcon from '../icons/DiskIcon';
import DownloadThickIcon from '../icons/DownloadThickIcon';
import Duration from '../general/Duration';
import HashIcon from '../icons/HashIcon';
import FolderClosedSolid from '../icons/FolderClosedSolid';
import PeersIcon from '../icons/PeersIcon';
import LockIcon from '../icons/LockIcon';
import Ratio from '../general/Ratio';
import RadarIcon from '../icons/RadarIcon';
import RatioIcon from '../icons/RatioIcon';
import SeedsIcon from '../icons/SeedsIcon';
import Size from '../general/Size';
import TrackerMessageIcon from '../icons/TrackerMessageIcon';
import UploadThickIcon from '../icons/UploadThickIcon';

const booleanRenderer = (value) => {
  return value ? icons.checkmark : null;
};
const dateRenderer = date => <FormattedDate value={date * 1000} />;
const peersRenderer = (peersConnected, totalPeers) => {
  return (
    <FormattedMessage
      id="torrent.list.peers"
      defaultMessage="{connected} {of} {total}"
      values={{
        connected: <FormattedNumber value={peersConnected} />,
        of: (
          <em className="unit">
            <FormattedMessage id="torrent.list.peers.of"
              defaultMessage="of" />
          </em>
        ),
        total: <FormattedNumber value={totalPeers} />
      }} />
  );
};
const speedRenderer = value => <Size value={value} isSpeed={true} />;
const sizeRenderer = value => <Size value={value} />;

const icons = {
  checkmark: <Checkmark className="torrent__detail__icon torrent__detail__icon--checkmark" />,
  comment: <CommentIcon />,
  detailNotAvailable: <DetailNotAvailableIcon />,
  eta: <ClockIcon />,
  sizeBytes: <DiskIcon />,
  downRate: <DownloadThickIcon />,
  basePath: <FolderClosedSolid />,
  hash: <HashIcon />,
  dateAdded: <CalendarIcon />,
  dateCreated: <CalendarCreatedIcon />,
  isPrivate: <LockIcon />,
  message: <TrackerMessageIcon />,
  percentComplete: <DownloadThickIcon />,
  peers: <PeersIcon />,
  ratio: <RatioIcon />,
  seeds: <SeedsIcon />,
  trackerURIs: <RadarIcon />,
  upRate: <UploadThickIcon />,
  upTotal: <UploadThickIcon />
};

const transformers = {
  dateAdded: dateRenderer,
  dateCreated: dateRenderer,
  downRate: speedRenderer,
  downTotal: sizeRenderer,
  ignoreScheduler: booleanRenderer,
  isPrivate: booleanRenderer,
  percentComplete: (percent, size) => {
    return (
      <span>
        <FormattedNumber value={percent} />
        <em className="unit">%</em>
        &nbsp;&mdash;&nbsp;
        <Size value={size} />
      </span>
    );
  },
  peers: peersRenderer,
  seeds: peersRenderer,
  tags: tags => {
    return (
      <ul className="torrent__tags tag">
        {tags.map((tag, index) => {
          return (
            <li className="torrent__tag" key={index}>{tag}</li>
          );
        })}
      </ul>
    );
  },
  ratio: ratio => <Ratio value={ratio} />,
  sizeBytes: sizeRenderer,
  trackerURIs: trackers => trackers.join(', '),
  upRate: speedRenderer,
  upTotal: sizeRenderer,
  eta: eta => {
    if (!eta) {
      return null;
    }

    return <Duration value={eta} />;
  }
};

class TorrentDetail extends React.Component {
  render() {
    let {
      className,
      hash,
      icon,
      isSelected,
      preventTransform,
      secondaryValue,
      slug,
      style,
      value
    } = this.props;

    if (!preventTransform && slug in transformers) {
      value = transformers[slug](value, secondaryValue);
    }

    if (!value) {
      value = icons.detailNotAvailable;
    }

    if (icon) {
      icon = icons[slug];
    }

    const classes = classnames('torrent__detail', {
      [`torrent__detail--${slug}`]: slug,
      [className]: className,
      'torrent__detail--is-selected': isSelected
    });

    return (
      <div
        className={classes}
        data-hash={hash}
        style={style}
      >
        {icon}
        {value}
      </div>
    );
  }
}

TorrentDetail.defaultProps = {
  preventTransform: false,
  className: ''
};

export default TorrentDetail;
