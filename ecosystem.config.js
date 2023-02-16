module.exports = {
  apps: [
    {
      name: 'luban',
      script: './dist-backend/backend/index.js',
      node_args: [],
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1200M',
      merge_logs: true,
      exec_mode: 'cluster',
    },
  ],
};
