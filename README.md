# electron-google-meet

Google Meet Desktop application with Electron, to steamline the google meet experience to the zoom experience, specially useful for firefox users that in the browser have a crippled version of the "google meet" experience.

**NOTE**: this fork has the following new features:

- support screen sharing
- use latest electron version (no more unsupported chrome version detected)
- properly support window placement (with an invisible bar on the top)
- uses an url protocol to be able to launch it directly from another browser/application.
- **TESTED** only on macOS

## Usage

This application put the icon in the tray bar: if the icon is not working for you, use the option
`--disable-tray` on the command line to avoid that minimizing the main window, there is no way to
bring it back.

Use the command line switch --room-id=<id> to connect directly to the meeting with the specified
room ID.

## Url protocol

This application works together with the `x-url2app://` URL handler (firefox addon [here](https://addons.mozilla.org/firefox/addon/url2app), sources [here](https://github.com/shvchk/url2app#readme)) to be able to open a new meeting address by right clicking it and using `> Open in App`.

The URL protocol works both when the application is not open or when it's already opened.

## Credits

Initial code from [AlexArcher/electron-google-meet](https://github.com/AlexArcher/electron-google-meet).
