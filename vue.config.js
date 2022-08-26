

module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      "^/api": {
        target: "https://php-staging.anyteach.cn",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      },
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "AnyTeach",
        appId: "com.anyteach.desktop",
        copyright: `版权所有 © ${new Date().getUTCFullYear()} 厦门市睿博东方文化传媒有限公司`,
        dmg: {
          sign: false
        },
        mac: {
          target: ["dmg", "zip"],
          publish: [
            {
              provider: "generic",
              url: "https://anyteach2.oss-cn-shenzhen.aliyuncs.com/"
            }
          ],
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist"
        },
        win: {
          publish: [
            {
              provider: "generic",
              url: "https://anyteach2.oss-cn-shenzhen.aliyuncs.com/"
            }
          ],
          target: [
            {
              target: "nsis",
              arch: ["ia32"]
            }
          ]
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/base.scss";
        `
      }
    }
  }
}
