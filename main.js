const {app, BrowserWindow, shell, session, desktopCapturer, dialog} = require('electron');
const path = require('path')

const menu = require('./menu.js');
const touchbar = require('./touchbar.js');
const tray = require('./tray.js');
const meet = require('./meet.js');

let mainWindow = null;
let queuedUrl = null;

if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('x-url2app', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('x-url2app');
}


if (app.commandLine.hasSwitch('help')) {
    console.log("Usage:");
    console.log("  --room-id=<id>  - Connect to the given room")
    console.log("  --disable-tray  - Disable the tray bar icon");
    console.log("  --help          - Show this help");
    process.exit(0);
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        icon: tray.getIcon(false),
        width: 1280,
        height: 800,
        frame: false,
        focusable: false,
        webPreferences: {
            preload: path.join(__dirname, 'browser.js'),
            nodeIntegration: false,
            contextIsolation: false,
        }
    });

    // this code enables screen sharing
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          // Grant access to the first screen found, this is a fallback, the system picker will be used if available
          callback({ video: sources[0], audio: 'loopback' })
        })
        // use the system picker if available, otherwise the callback above
    }, { useSystemPicker: true })

    let url = queuedUrl ?? 'https://meet.google.com/';
    if (app.commandLine.hasSwitch('room-id')) {
        url = 'https://meet.google.com/' + app.commandLine.getSwitchValue('room-id')
    }
    menu.init(meet);
    mainWindow.loadURL(url);
    mainWindow.setTouchBar(touchbar.init(meet));

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

    mainWindow.webContents.on('new-window', function(event, url, frameName, disposition, options) {
        event.preventDefault();
        shell.openExternal(url);
    });

    if (!app.commandLine.hasSwitch('disable-tray')) {
        tray.init(
            meet,
            () => {
                if (mainWindow.isVisible()) {
                    mainWindow.hide()
                } else {
                    mainWindow.show()
                    mainWindow.focus()
                }
            }
        );
    }
});

// Handle the protocol. In this case, we choose to show an Error Box.
app.on('open-url', (event, sourceUrl) => {
    let url = sourceUrl.split('://')[1];
    url = url.replace("https//", "https://");
    if (mainWindow) {
        mainWindow.loadURL(url);
        mainWindow.show();
        mainWindow.focus();
    } else {
        queuedUrl = url;
    }
})