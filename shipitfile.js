module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-npm')(shipit);
  require('shipit-pm2')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/home/deploy/workspace/NodeMDBlog',
      repositoryUrl: 'https://github.com/phaibin/NodeMDBlog.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      shallowClone: true,
    },
    staging: {
      servers: 'phaibin-vultr'
    }
  });
};
