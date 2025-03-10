const Store = require('electron-store');

const defaults = {
  skipPrivate: true,
  currentUsername: undefined,
  usersToFollowFollowersOf: ['@lostleblanc', '@samkolder', '@bomkanari'],

  maxFollowsPerHour: 20,
  maxFollowsPerDay: 150,
  maxLikesPerDay: 50,
  maxLikesPerUser: 2,
  followUserRatioMin: 0.2,
  followUserRatioMax: 4.0,
  followUserMaxFollowers: null,
  followUserMaxFollowing: null,
  followUserMinFollowers: null,
  followUserMinFollowing: 10,
  dontUnfollowUntilDaysElapsed: 5,
  runAtHour: 10,
  fullName: undefined,
  profilePicture: undefined,
  followersCount: undefined,
  followCount: undefined,
  biography: undefined,
};

const store = new Store({
  defaults,
});

module.exports = { store, defaults };
