module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  
  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/home/deploy/workspace/NodeMDBlog',
      repositoryUrl: 'https://github.com/phaibin/NodeMDBlog.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      shallowClone: true
    },
    staging: {
      servers: 'phaibin-vultr'
    }
  });

  shipit.task('pwd', function () {
    return shipit.remote('pwd');
  });
};
