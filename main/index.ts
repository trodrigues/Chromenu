import * as path from 'path';
import * as menubar from 'menubar';
import {app, globalShortcut, BrowserWindow} from 'electron';
import loadConfig from './config';
import log from './log';

process.on('unhandledRejection', (reason: string) => {
    log.error('FATAL: Unhandled rejection! Reason:', reason);
});

const Html = `file://${path.join(__dirname, '..', 'renderer', 'index.html')}`;
const IsDebug = process.env.NODE_ENV === 'development';
const DefaultWidth = 414;  // iPhone 6s
const DefaultHeight = 50 + 10 + 736 + 50; // Icon area height + iPhone 6s + footer

function setupMenuBar(config: Config) {
    log.debug('Setup a menubar window');
    return new Promise<Menubar.MenubarApp>(resolve => {
        const icon = path.join(__dirname, '..', 'resources', `chrome-tray-icon-${config.icon_color}.png`);
        log.debug('Will launch application:', Html, icon);
        const mb = menubar({
            index: Html,
            icon,
            width: DefaultWidth,
            height: DefaultHeight,
            alwaysOnTop: IsDebug || !!config.always_on_top,
        });
        mb.once('ready', () => mb.showWindow());
        mb.once('after-create-window', () => {
            log.debug('Menubar application was launched');
            if (config.hot_key) {
                globalShortcut.register(config.hot_key, () => {
                    if (mb.window.isFocused()) {
                        log.debug('Toggle window: shown -> hidden');
                        mb.hideWindow();
                    } else {
                        log.debug('Toggle window: hidden -> shown');
                        mb.showWindow();
                    }
                });
                log.debug('Hot key was set to:', config.hot_key);
            }
            if (IsDebug) {
                mb.window.webContents.openDevTools({mode: 'detach'});
            }
            mb.window.webContents.once('dom-ready', () => {
                mb.window.webContents.send('chromenu:config', config);
            });
            resolve(mb);
        });
    });
}

function setupNormalWindow(config: Config) {
    log.debug('Setup a normal window');
    return new Promise<Electron.BrowserWindow>(resolve => {
        const win = new BrowserWindow({
            width: DefaultWidth,
            height: DefaultHeight,
            icon: path.join(__dirname, '..', 'resources', 'icon', 'app.png'),
        });
        win.loadURL(Html);
        win.webContents.once('dom-ready', () => {
            log.debug('Normal window application was launched');
            if (config.hot_key) {
                globalShortcut.register(config.hot_key, () => {
                    if (win.isFocused()) {
                        log.debug('Toggle window: shown -> hidden');
                        win.hide();
                    } else {
                        log.debug('Toggle window: hidden -> shown');
                        win.show();
                    }
                });
                log.debug('Hot key was set to:', config.hot_key);
            }
            win.webContents.send('chromenu:config', config);
            if (IsDebug) {
                win.webContents.openDevTools({mode: 'detach'});
            }
            if (process.platform === 'darwin') {
                app.dock.setIcon(path.join(__dirname, '..', 'resources', 'icon', 'app.png'));
            }
            resolve(win);
        });
    });
}

loadConfig().then(
    c => c.normal_window ? setupNormalWindow(c) : setupMenuBar(c)
).then(() => {
    log.debug('Application launched!');
});
