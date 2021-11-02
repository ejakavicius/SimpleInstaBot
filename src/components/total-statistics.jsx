import React, { memo } from 'react';
import { Statistic } from 'semantic-ui-react';

const TotalStatistics = memo(({ data: { numTotalFollowedUsers, numTotalUnfollowedUsers, numTotalLikedPhotos } }) => (
  <Statistic.Group color="purple" size="mini">
    <Statistic label="Followed" value={numTotalFollowedUsers} />
    <Statistic label="Unfollowed" value={numTotalUnfollowedUsers} />
    <Statistic label="Liked" value={numTotalLikedPhotos} />
  </Statistic.Group>
));

export default TotalStatistics;
