module.exports = {
  // packagerConfig: { ... },
  // electronRebuildConfig: { ... },
  makers: [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "anyteach_electron"
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin",
        "win32",
      ]
    },
    // {
    //   "name": "@electron-forge/maker-deb",
    //   "config": {}
    // },
    // {
    //   "name": "@electron-forge/maker-rpm",
    //   "config": {}
    // }
  ],
  // publishers: [ ... ],
  // plugins: [ ... ],
  // hooks: { ... },
  // buildIdentifier: "anyteach-electron"
}