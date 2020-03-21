import log from "electron-log"
import { app, protocol, BrowserWindow, Menu, ipcMain } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import { autoUpdater } from "electron-updater"

const isDevelopment = process.env.NODE_ENV !== "production"
const isProduction = process.env.VUE_APP_MODE === "production"
const isMac = process.platform === "darwin"

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"

function sendStatusToWindow(text) {
  log.info(text)
  win.webContents.send("message", text)
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...")
})
autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.")
})
autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.")
})
autoUpdater.on("error", err => {
  sendStatusToWindow("Error in auto-updater. " + err)
})
autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + " - Downloaded " + progressObj.percent + "%"
  log_message =
    log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")"
  sendStatusToWindow(log_message)
})
autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded")
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
])

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1000,
    minHeight: 600 + 22,
    // backgroundColor: "#e6e6e6",
    webPreferences: {
      nodeIntegration: true
    },
    title: "AnyTeach",
    show: true
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol("app")
    // Load the index.html when not in development
    win.loadURL("app://./index.html")
  }

  win.once("ready-to-show", () => {
    win.show()
  })

  win.on("closed", () => {
    win = null
  })

  win.on("will-resize", (event, newBounds) => {
    win.webContents.send("will-resize", newBounds)
  })
}

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" }
          ]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }]
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: isProduction
      ? [{ role: "togglefullscreen" }]
      : [
          { role: "reload" },
          { role: "forcereload" },
          { role: "toggledevtools" },
          { type: "separator" },
          { type: "separator" },
          { role: "togglefullscreen" }
        ]
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" }
          ]
        : [{ role: "close" }])
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "访问官网",
        click: async () => {
          const { shell } = require("electron")
          await shell.openExternal("https://anyteach.cn")
        }
      }
    ]
  }
]

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (process.env.VUE_APP_MODE === "development") {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await require("vue-cli-plugin-electron-builder/lib").installVueDevtools()
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }
  createWindow()
  if (isMac) {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    win.removeMenu()
  }
  autoUpdater.checkForUpdatesAndNotify()
})

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit()
      }
    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}
