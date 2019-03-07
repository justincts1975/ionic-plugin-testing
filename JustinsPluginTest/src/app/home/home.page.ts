import {Component, NgZone} from '@angular/core';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {PowerManagement} from '@ionic-native/power-management/ngx';

declare var cordova;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public isWakeLockActive = false;
    public disableMoveToFront = false;

    constructor(private bgMode: BackgroundMode,
                private powerMgmt: PowerManagement,
                private zone: NgZone) {

    }

    public toggleWakeLock() {
        if (this.isWakeLockActive) {
            this.detachWakeLock();
        } else {
            this.attachWakeLock();
        }
    }

    public async toggleBackgroundMode() {
        if (this.isBackgroundModeEnabled) {
            const result = await this.bgMode.disable();
        } else {
            this.bgMode.enable();
        }
    }

    public moveToFront() {
        this.bgMode.moveToBackground();
        this.disableMoveToFront = true;
        window.setTimeout(x => {

            this.zone.runGuarded(y => {
                if (window['plugins'] && window['plugins'].bringtofront) {
                    window['plugins'].bringtofront();
                }

                this.disableMoveToFront = false;
                if (this.bgMode.isScreenOff()) {
                    this.bgMode.wakeUp();
                }
                this.bgMode.unlock();
                this.bgMode.moveToForeground();

                alert('we\'re back!');
            });
        }, 10000);
    }

    public moveToFront2() {
        // this.bgMode.moveToBackground();
        this.disableMoveToFront = true;
        window.setTimeout(x => {

            this.zone.runGuarded(y => {
                this.disableMoveToFront = false;

                if (window['plugins'] && window['plugins'].bringtofront) {
                    window['plugins'].bringtofront();
                }

                if (this.bgMode.isScreenOff()) {
                    this.bgMode.wakeUp();
                }
                this.bgMode.unlock();
                this.bgMode.moveToForeground();

                alert('we\'re back!');
            });
        }, 10000);
    }

    public get isBackgroundModeEnabled(): boolean {
        return this.bgMode.isEnabled();
    }

    private attachWakeLock() {
        this.powerMgmt.acquire()
            .then(() => {
                this.isWakeLockActive = true;
                alert('WakeLock acquired');
            })
            .catch(e => {
                alert('WakeLock acquisition failed');
            });
    }

    private detachWakeLock() {
        this.powerMgmt.release()
            .then(() => {
                this.isWakeLockActive = false;
                alert('WakeLock released');
            })
            .catch(() => {
                alert('WakeLock release failed');
            });
    }
}
