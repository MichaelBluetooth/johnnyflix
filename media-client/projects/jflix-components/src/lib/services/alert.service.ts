import { Injectable, ViewContainerRef } from '@angular/core';
import { AlertComponent, AlertType } from '../components/alert/alert.component';

@Injectable()
export class JFlixAlertService {
    private viewContainerRef: ViewContainerRef;
    private alerts = [];

    setAlertViewContainer(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }

    alert(message: string, type: AlertType, isLight = false, timeToLiveMS = null) {
        const componentRef = this.viewContainerRef.createComponent(AlertComponent);
        componentRef.instance.isLight = isLight;
        componentRef.instance.type = type;
        componentRef.instance.message = message;
        componentRef.instance.dismiss.subscribe(() => {
            componentRef.destroy();
        });

        if (timeToLiveMS) {
            setTimeout(() => {
                componentRef?.destroy();
            }, timeToLiveMS);
        }
    }
}
