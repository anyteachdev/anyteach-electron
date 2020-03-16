module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "AnyTeach",
        dmg: {
          sign: false
        },
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist"
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
