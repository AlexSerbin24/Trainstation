import { Controller, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GATEWAY_NOTIFICATION_SERVICE } from '../constants/services.constants';
import { ClientProxy } from '@nestjs/microservices';
import { PROCESS_PENDING_MESSAGES } from '@app/messages';
import { lastValueFrom } from 'rxjs';


@Controller()
export class EmailtServiceController {
    constructor(
        @Inject(GATEWAY_NOTIFICATION_SERVICE)
        private readonly gatewayNotificatioProxy: ClientProxy) {

    }

    @Cron('* * * * *')
    async handleCron() {
        console.log("Process")
        await lastValueFrom(this.gatewayNotificatioProxy.emit({cmd:PROCESS_PENDING_MESSAGES},{}));
    }
}