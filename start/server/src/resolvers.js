module.exports = {
  Query: {
    launches: (_, __, { dataSources }) =>
      dataSources.launchAPI.getAllLaunches(),

    launch: (_, __, { dataSource }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  }
}
