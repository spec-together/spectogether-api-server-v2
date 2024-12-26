//ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "spectogether",
      script: "./index.js",
      instances: 0,
      exec_mode: "cluster",
    },
  ],
};
