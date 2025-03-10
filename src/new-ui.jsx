import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import get from 'lodash/get';
import { Card, Grid, Menu, Button, Image, Header } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './styles.module.css';

import LogView from './components/logs';
import HelpTab from './components/help';
import AdvancedSettings from './components/advanced-settings';
import RecentStatistics from './components/recent-statistics';
import TotalStatistics from './components/total-statistics';
import getProfilePicture from './services/image';
import LoggedInCard from './components/logged-in-card';
import LogInCard from './components/login-card';
import AudienceCard from './components/audience-card';

const electron = window.require('electron');
// const isDev = window.require('electron-is-dev');

const { powerSaveBlocker } = electron.remote.require('electron');
const {
  initInstautoDb,
  initInstauto,
  runBot,
  cleanupInstauto,
  checkHaveCookies,
  deleteCookies,
  getInstautoData,
  getUserProfile,
  stopBot,
} = electron.remote.require('./electron');
const { store: configStore } = electron.remote.require('./store');

const ReactSwal = withReactContent(Swal);

const MENU_ITEMS = {
  home: 'HOME',
  logs: 'LOGS',
  help: 'HELP',
};

const App = memo(() => {
  const [instantStart, setInstantStart] = useState(true);
  const [menuItemSelected, setMenuItem] = useState(MENU_ITEMS.home);
  const [haveCookies, setHaveCookies] = useState(false);
  const [running, setRunning] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [skipPrivate, setSkipPrivate] = useState(configStore.get('skipPrivate'));
  const [usersToFollowFollowersOf, setUsersToFollowFollowersOf] = useState(configStore.get('usersToFollowFollowersOf'));
  const [currentUsername, setCurrentUsername] = useState(configStore.get('currentUsername'));
  const [logs, setLogs] = useState([]);
  const [instautoData, setInstautoData] = useState();

  const [userProfile, setUserProfile] = useState({
    fullName: configStore.get('fullName'),
    profilePicture: configStore.get('profilePicture'),
    followersCount: configStore.get('followersCount'),
    followCount: configStore.get('followCount'),
    biography: configStore.get('biography'),
  });

  useEffect(() => configStore.set('fullName', userProfile.fullName), [userProfile.fullName]);
  useEffect(() => configStore.set('profilePicture', userProfile.profilePicture), [userProfile.profilePicture]);
  useEffect(() => configStore.set('followersCount', userProfile.followersCount), [userProfile.followersCount]);
  useEffect(() => configStore.set('followCount', userProfile.followCount), [userProfile.followCount]);
  useEffect(() => configStore.set('biography', userProfile.biography), [userProfile.biography]);

  const [advancedSettings, setAdvancedSettings] = useState({
    maxFollowsPerDay: configStore.get('maxFollowsPerDay'),
    maxFollowsPerHour: configStore.get('maxFollowsPerHour'),
    maxLikesPerDay: configStore.get('maxLikesPerDay'),
    maxLikesPerUser: configStore.get('maxLikesPerUser'),
    followUserRatioMin: configStore.get('followUserRatioMin'),
    followUserRatioMax: configStore.get('followUserRatioMax'),
    followUserMaxFollowers: configStore.get('followUserMaxFollowers'),
    followUserMaxFollowing: configStore.get('followUserMaxFollowing'),
    followUserMinFollowers: configStore.get('followUserMinFollowers'),
    followUserMinFollowing: configStore.get('followUserMinFollowing'),
    dontUnfollowUntilDaysElapsed: configStore.get('dontUnfollowUntilDaysElapsed'),
    runAtHour: configStore.get('runAtHour'),
  });

  function setAdvancedSetting(key, value) {
    setAdvancedSettings(s => ({ ...s, [key]: value }));
  }

  useEffect(() => configStore.set('maxFollowsPerDay', advancedSettings.maxFollowsPerDay), [advancedSettings.maxFollowsPerDay]);
  useEffect(() => configStore.set('maxFollowsPerHour', advancedSettings.maxFollowsPerHour), [advancedSettings.maxFollowsPerHour]);
  useEffect(() => configStore.set('maxLikesPerDay', advancedSettings.maxLikesPerDay), [advancedSettings.maxLikesPerDay]);
  useEffect(() => configStore.set('maxLikesPerUser', advancedSettings.maxLikesPerUser), [advancedSettings.maxLikesPerUser]);
  useEffect(() => configStore.set('followUserRatioMin', advancedSettings.followUserRatioMin), [advancedSettings.followUserRatioMin]);
  useEffect(() => configStore.set('followUserRatioMax', advancedSettings.followUserRatioMax), [advancedSettings.followUserRatioMax]);
  useEffect(() => configStore.set('followUserMaxFollowers', advancedSettings.followUserMaxFollowers), [advancedSettings.followUserMaxFollowers]);
  useEffect(() => configStore.set('followUserMaxFollowing', advancedSettings.followUserMaxFollowing), [advancedSettings.followUserMaxFollowing]);
  useEffect(() => configStore.set('followUserMinFollowers', advancedSettings.followUserMinFollowers), [advancedSettings.followUserMinFollowers]);
  useEffect(() => configStore.set('followUserMinFollowing', advancedSettings.followUserMinFollowing), [advancedSettings.followUserMinFollowing]);
  useEffect(() => configStore.set('dontUnfollowUntilDaysElapsed', advancedSettings.dontUnfollowUntilDaysElapsed), [advancedSettings.dontUnfollowUntilDaysElapsed]);
  useEffect(() => configStore.set('runAtHour', advancedSettings.runAtHour), [advancedSettings.runAtHour]);

  useEffect(() => (currentUsername ? configStore.set('currentUsername', currentUsername) : configStore.delete('currentUsername')), [currentUsername]);

  function onUsersToFollowFollowersOfChange(newVal) {
    // Some people try hashtags
    setUsersToFollowFollowersOf(newVal.filter((v) => !v.startsWith('#')));
  }

  // Testing
  // useEffect(() => isDev && setRunning(true), []);

  const usersToFollowFollowersOfCleaned = useMemo(() => usersToFollowFollowersOf.map(user => user.replace(/^@/g, '')), [usersToFollowFollowersOf]);

  useEffect(() => configStore.set('skipPrivate', skipPrivate), [skipPrivate]);
  useEffect(() => configStore.set('usersToFollowFollowersOf', usersToFollowFollowersOf), [usersToFollowFollowersOf]);

  const fewUsersToFollowFollowersOf = usersToFollowFollowersOf.length < 5;

  // This could be improved in the future
  const maxFollowsTotal = advancedSettings.maxFollowsPerDay;

  async function updateCookiesState() {
    setHaveCookies(await checkHaveCookies());
  }

  const refreshInstautoData = useCallback(() => {
    setInstautoData(getInstautoData());
  }, []);

  const isLoggedIn = !!(currentUsername && haveCookies);

  const credentialsSet = !!(username && password);

  const disableTestBot = (!isLoggedIn && !credentialsSet) || running || usersToFollowFollowersOf.length < 1;

  const disableStartBot = (!isLoggedIn && !credentialsSet) || fewUsersToFollowFollowersOf;

  useEffect(() => {
    (async () => {
      if (!isLoggedIn) return;
      await initInstautoDb(currentUsername);
      refreshInstautoData();
    })().catch(console.error);
  }, [currentUsername, isLoggedIn, refreshInstautoData]);

  useEffect(() => {
    updateCookiesState();
  }, []);

  async function onLogoutClick() {
    await deleteCookies();
    await updateCookiesState();
    setCurrentUsername();
    cleanupInstauto();

    refreshInstautoData();
  }

  async function onStartPress({ dryRun = false }) {
    if (running) {
      await updateCookiesState();
      setRunning(false);
      await stopBot();
      return;
    }

    setLogs([]);
    setRunning(true);

    const powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');

    function log(level, ...args) {
      console[level](...args);
      setLogs((l) => [...l, { time: new Date(), level, args }]);
    }

    const logger = {
      log: (...args) => log('log', ...args),
      error: (...args) => log('error', ...args),
      warn: (...args) => log('warn', ...args),
      info: (...args) => log('info', ...args),
      debug: (...args) => log('debug', ...args),
    };

    try {
      if (isLoggedIn) {
        await initInstautoDb(currentUsername);
      } else {
        await deleteCookies(); // Maybe they had cookies but not yet any currentUsername (old version)
        setCurrentUsername(username);
        await initInstautoDb(username);
      }
      refreshInstautoData();

      setMenuItem(MENU_ITEMS.logs);

      await initInstauto({
        ...advancedSettings,

        excludeUsers: [],

        dryRun,

        username,
        password,

        logger,
      });

      const profile = await getUserProfile();
      const profilePicture = await getProfilePicture(get(profile, 'profile_pic_url'));
      setUserProfile({
        fullName: get(profile, 'full_name'),
        profilePicture,
        followersCount: get(profile, 'edge_followed_by.count'),
        followCount: get(profile, 'edge_follow.count'),
        biography: get(profile, 'biography'),
      });

      await runBot({
        usernames: usersToFollowFollowersOfCleaned,
        ageInDays: advancedSettings.dontUnfollowUntilDaysElapsed,
        skipPrivate,
        runAtHour: advancedSettings.runAtHour,
        maxLikesPerUser: advancedSettings.maxLikesPerUser,
        maxFollowsTotal,
        instantStart,
      });
    } catch (err) {
      logger.error('Failed to run', err);
      await ReactSwal.fire({
        icon: 'error',
        title: 'Failed to run',
        html: (
          <div style={{ textAlign: 'left' }}>
            Try the troubleshooting button. Error:
            <div style={{ color: '#aa0000' }}>{err.message}</div>
          </div>
        ),
      });
      await onLogoutClick();
    } finally {
      setRunning(false);
      cleanupInstauto();
      powerSaveBlocker.stop(powerSaveBlockerId);
    }
  }

  const handleMenuClick = (e, { name }) => setMenuItem(name);

  const renderHome = () => (
    <Grid.Column floated="left" width={12}>
      {isLoggedIn ? (
        <LoggedInCard userProfile={userProfile} onLogoutClick={onLogoutClick} currentUsername={currentUsername} />
      ) : (
        <LogInCard
          username={username}
          password={password}
          onUsernameChange={e => setUsername(e.target.value)}
          onPasswordChange={e => setPassword(e.target.value)}
        />
      )}
      <AudienceCard
        fewUsersToFollowFollowersOf={fewUsersToFollowFollowersOf}
        usersToFollowFollowersOf={usersToFollowFollowersOf}
        onUsersToFollowFollowersOfChange={onUsersToFollowFollowersOfChange}
      />
      <Card fluid>
        <Card.Content header="3. Adjust Settings" />
        <Card.Content>
          <AdvancedSettings
            skipPrivate={skipPrivate}
            setSkipPrivate={setSkipPrivate}
            advancedSettings={advancedSettings}
            changeSetting={setAdvancedSetting}
            instantStart={instantStart}
            setInstantStart={setInstantStart}
          />
        </Card.Content>
      </Card>
    </Grid.Column>
  );

  const renderLogs = () => (
    <Grid.Column floated="left" width={12}>
      <Card centered fluid>
        <Card.Content header="Recent Stats" description="Stats for the past 24h" />
        <Card.Content centered>
          {instautoData && <RecentStatistics data={instautoData} />}
        </Card.Content>
      </Card>
      <Card centered fluid>
        <Card.Content header="Total Stats" description="Overall stats" />
        <Card.Content centered>
          {instautoData && <TotalStatistics data={instautoData} />}
        </Card.Content>
      </Card>
      <LogView logs={logs} fontSize={13} style={{ height: '100%' }} instautoData={instautoData} />
    </Grid.Column>
  );

  const renderHelp = () => (
    <Grid.Column floated="left" width={12}>
      <HelpTab />
    </Grid.Column>
  );

  const MENU_CONTENT = {
    [MENU_ITEMS.home]: renderHome,
    [MENU_ITEMS.logs]: renderLogs,
    [MENU_ITEMS.help]: renderHelp,
  };

  return (
    <div>
      <Menu fixed="left" color="purple" pointing secondary vertical style={{ width: '250px', borderRightWidth: 1 }}>
        <Menu.Item style={{ height: '57px', borderBottomWidth: '1px', borderBottomColor: '#22242626', borderBottomStyle: 'solid' }}>
          <Header as="h3">
            <Image size="tiny" src="https://react.semantic-ui.com/images/avatar/large/patrick.png" /> InstaBot
          </Header>
        </Menu.Item>
        <Menu.Item style={{ marginTop: '20px' }} disabled={running} content="Home" name={MENU_ITEMS.home} active={menuItemSelected === MENU_ITEMS.home} onClick={handleMenuClick} />
        <Menu.Item content="Logs & Stats" name={MENU_ITEMS.logs} active={menuItemSelected === MENU_ITEMS.logs} onClick={handleMenuClick} />
        <Menu.Item content="Help" name={MENU_ITEMS.help} active={menuItemSelected === MENU_ITEMS.help} onClick={handleMenuClick} />
      </Menu>
      <div className={styles.floatingHeader}>
        <Button disabled={disableTestBot} onClick={() => onStartPress({ dryRun: true })} content="Test Bot" basic color="purple" />
        <Button disabled={disableStartBot} negative={running} content={running ? 'Stop bot' : 'Start bot'} onClick={onStartPress} color="purple" />
      </div>
      <Grid style={{ marginLeft: '250px', marginRight: '0px' }}>
        {MENU_CONTENT[menuItemSelected]()}

        <Grid.Column floated="left" width={4}>
          <Card
            header="How it works"
            description="List of accounts whose followers the bot should follow. Choose accounts with a lot of followers (e.g influencers above 100k). The bot will then visit each of these and follow their most recent followers, in hope that they will follow you back. 5 days later, it will unfollow them. For best results, choose accounts from a niche market that you want to target."
          />
          <Card
            header="Tip #1"
            description="To avoid temporary blocks, please run the bot on the same internet/WiFi as you normally use your Instagram app. Do not use a VPN."
          />
        </Grid.Column>
      </Grid>
    </div>
  );
});

export default App;
