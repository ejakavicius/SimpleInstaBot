import React, { memo } from 'react';
import { Statistic } from 'semantic-ui-react';

const RecentStatistics = memo(({ data: { numFollowedLastDay, numUnfollowedLastDay, numLikedLastDay } }) => (
  <Statistic.Group color="red" size="mini">
    <Statistic label="Followed" value={numFollowedLastDay} />
    <Statistic label="Unfollowed" value={numUnfollowedLastDay} />
    <Statistic label="Liked" value={numLikedLastDay} />
  </Statistic.Group>
));

export default RecentStatistics;
