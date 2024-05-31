import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TrainContext, TrainRemindContext, TrainUpdateContext } from '../../dto/notifications-contexts.dto';
import { EmailMessages } from '../../enums/email-messages.enum';
import { RemoveTrainNotificationPayload, UpdateTrainNotificationPayload, RemindTrainNotificationPayload } from '@app/dtos/notification/notifications-payloads.dto';
import { ADD_REMIND_NOTIFICATION, CANCEL_TRAIN_NOTIFICATION, PROCESS_PENDING_MESSAGES, UPDATE_TRAIN_NOTIFICATION } from '@app/messages';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @EventPattern({ cmd: UPDATE_TRAIN_NOTIFICATION })
  async handleUpdateTrain(@Payload() updateTrainNotificationPayload: UpdateTrainNotificationPayload) {
    try {
      const { users, trainData } = updateTrainNotificationPayload;
      for (const user of users) {
        const trainUpdateContext: TrainUpdateContext = {
          routeSegments: trainData.routeSegments.map(segm => ({
            station: segm.station,
            departureDate: segm.departureDate ? new Date(segm.departureDate).toLocaleString() : undefined,
            arrivalDate: segm.arrivalDate ? new Date(segm.arrivalDate).toLocaleString() : undefined
          })),
          trainNumber: trainData.trainNumber,
          firstName: user.firstname,
          lastName: user.lastname
        };


        await this.emailService.sendEmail(user.email, EmailMessages.UPDATE, trainUpdateContext);
      }
    } catch (error) {
      console.error('Error handling update_train message:', error);
    }
  }

  @EventPattern({ cmd: CANCEL_TRAIN_NOTIFICATION })
  async handleCancelTrain(@Payload() removeTrainNotificationPayload: RemoveTrainNotificationPayload) {
    try {
      const { users, trainData } = removeTrainNotificationPayload;

      for (const user of users) {
        const trainContext: TrainContext = {
          trainNumber: trainData.trainNumber,
          firstName: user.firstname,
          lastName: user.lastname
        };
        await this.emailService.sendEmail(user.email, EmailMessages.CANCEL, trainContext);
      }
    } catch (error) {
      console.error('Error handling cancel_train message:', error);
    }
  }

  @EventPattern({ cmd: ADD_REMIND_NOTIFICATION })
  async handleAddRemindMessage(@Payload() remindTrainNotificationPayloads: RemindTrainNotificationPayload[]) {
    try {

      for (const remindTrainNotificationPayload of remindTrainNotificationPayloads) {

        const { user, trainData, date } = remindTrainNotificationPayload;
        console.log(trainData)
        const trainContext: TrainRemindContext = {
          trainNumber: trainData.trainNumber,
          departure: trainData.departure,
          departureDate: new Date(trainData.departureDate).toLocaleString(),
          arrival: trainData.arrival,
          arrivalDate: new Date(trainData.arrivalDate).toLocaleString(),
          firstName: user.firstname,
          lastName: user.lastname
        };
        console.log(trainContext)
        await this.emailService.createSceduleEmail(user.email, EmailMessages.REMIND, trainContext, date);
      }
    } catch (error) {
      console.error('Error handling add_remind message:', error);
    }
  }


  @EventPattern({ cmd: PROCESS_PENDING_MESSAGES })
  async handlePendingMessages() {
    await this.emailService.processPendingEmails();
  }

}
