module.exports = {
  apps: [
    {
      name: "spectogether",
      script: "./index.js",
      instances: 2, // 고정값 설정 (CPU 코어 수에 따라 조정 가능)
      exec_mode: "cluster",
      log_file: "./logs/combined.log",
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
    },
  ],
};
