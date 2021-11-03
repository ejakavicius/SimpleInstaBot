import React, { memo } from 'react';
import { Accordion, Form, Message } from 'semantic-ui-react';

const AdvancedSettings = memo(({
  advancedSettings, skipPrivate, setSkipPrivate, changeSetting, instantStart, setInstantStart,
}) => {
  const handleInputChange = (e, { value }) => changeSetting(e.target.name, value);

  const generalActivityLimits = [
    {
      key: 'more',
      title: 'General Activity Limits',
      content: {
        content: (
          <div>
            <Form.Input
              name="maxFollowsPerDay"
              label="Limit follow and unfollow operations over 24 hours"
              value={advancedSettings.maxFollowsPerDay}
              onChange={handleInputChange}
            />
            <Form.Input
              name="maxFollowsPerHour"
              label="Limit follow and unfollow operations per hour"
              value={advancedSettings.maxFollowsPerHour}
              onChange={handleInputChange}
            />
            <Form.Input
              name="maxLikesPerDay"
              label="Limit total photo likes per 24 hours. NOTE: setting this too high may cause Action Blocked"
              value={advancedSettings.maxLikesPerDay}
              onChange={handleInputChange}
            />
            <Form.Input
              name="maxLikesPerUser"
              label="Like up to this number of photos on each user's profile. Set to 0 to deactivate liking photos"
              value={advancedSettings.maxLikesPerUser}
              onChange={handleInputChange}
            />
          </div>
        ),
      },
    },
  ];

  const followingActivityLimits = [
    {
      key: 'more',
      title: 'Following Activity Limits',
      content: {
        content: (
          <div>
            <Form.Input
              name="followUserRatioMin"
              label="Skip users that have a followers/following ratio lower than this"
              value={advancedSettings.followUserRatioMin}
              onChange={handleInputChange}
            />
            <Form.Input
              name="followUserRatioMax"
              label="Skip users that have a followers/following ratio higher than this"
              value={advancedSettings.followUserRatioMax}
              onChange={handleInputChange}
            />
            <Form.Input
              name="followUserMinFollowers"
              label="Skip users who have less followers than this"
              value={advancedSettings.followUserMinFollowers}
              onChange={handleInputChange}
            />
            <Form.Input
              name="followUserMaxFollowers"
              label="Skip users who have more followers than this"
              value={advancedSettings.followUserMaxFollowers}
              onChange={handleInputChange}
            />
            <Form.Input
              name="followUserMinFollowing"
              label="Skip users who follow less users than this"
              value={advancedSettings.followUserMinFollowing}
              onChange={handleInputChange}
            />
            <Form.Input
              name="dontUnfollowUntilDaysElapsed"
              label="Automatically unfollow auto-followed users after this number of days"
              value={advancedSettings.dontUnfollowUntilDaysElapsed}
              onChange={handleInputChange}
            />
          </div>
        ),
      },
    },
  ];


  return (
    <>
      <Form>
        <Form.Radio
          toggle
          label="Follow private accounts?"
          checked={!skipPrivate}
          onChange={(e, { checked }) => setSkipPrivate(!checked)}
        />
        <Form.Radio
          toggle
          label="Like a few photos after following users?"
          checked={advancedSettings.maxLikesPerUser > 0}
          onChange={(e, { checked }) => changeSetting('maxLikesPerUser', checked ? 2 : 0)}
        />

        <Form.Radio
          toggle
          label="Start Bot Immediately"
          checked={instantStart}
          onChange={(e, { checked }) => setInstantStart(checked)}
        />
        {!instantStart && (
        <Form.Input
          name="runAtHour"
          label="What time bot should start every day? (24hr based)"
          value={advancedSettings.runAtHour}
          onChange={handleInputChange}
        />
        )}

        <Accordion as={Form.Field} panels={generalActivityLimits} />

        <Accordion as={Form.Field} panels={followingActivityLimits} />
      </Form>
    </>
  );
});

export default AdvancedSettings;
