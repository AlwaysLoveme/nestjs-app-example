module.exports = {
  apps : [{
    // dist 文件更改，自动重启服务
    watch: true,
    name   : "app1",
    script : "./dist/main.js",
    // 忽略以下文件变动引起服务重启
    ignore_watch: ["./logs", "node_modules", "src", "prisma"]
  }]
}
