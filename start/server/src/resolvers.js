const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null, // launchesの最後の要素
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
          : false
      };
    },

    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },

  Mission: {
    // make sure the default size is "large" in case user does not specify.
    missionPatch: (mission, {size}  = {size: 'LARGE'}) => {
      return size == 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge
    },
  },

  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch( {launchId: launch.id} )
  },

  User: {
    trips: async(_, __, {dataSources}) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      //look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchById({
          launchIds,
        }) || []
      );
    }
  }
};
