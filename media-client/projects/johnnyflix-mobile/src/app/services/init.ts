import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { JflixBaseUrlService } from 'jflix-components';
import { Capacitor } from '@capacitor/core';

export function initializeApp(baseUrlSvc: JflixBaseUrlService) {
    return (): Promise<void> => new Promise(async r => {
        const platform = await Capacitor.getPlatform();
        
        if ('web' !== platform) {
            //todo: this base url needs to come from some user-entered config
            baseUrlSvc.setBaseUrl('http://10.189.81.136:3000/');

            //https://stackoverflow.com/a/69084017/821918
            //prevent "back" button from simply exiting the app
            CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                    CapacitorApp.exitApp();
                } else {
                    window.history.back();
                }
            });

            NavigationBar.setNavigationBarColor({
                color: '#14161A'
            });

            // await StatusBar.setStyle({ style: Style.Dark });

            await StatusBar.hide();
        }

        r();
    });
}
