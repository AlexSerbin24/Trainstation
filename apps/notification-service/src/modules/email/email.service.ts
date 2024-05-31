
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer'
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync } from 'fs';
import { NotificationContext } from '../../dto/notifications-contexts.dto';
import { LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { EmailMessages } from '../../enums/email-messages.enum';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {
    this.nodemailerTransport = createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      }
    });
  }



  async sendEmail(to: string, templateName: EmailMessages, context: NotificationContext) {


    const subject = this.getSubjectByTemplateType(templateName);

    const template = this.loadTemplate(templateName);
    const html = template(context, {});

    const mailOptions = {
      to,
      subject,
      html,
    };

    try {
      await this.nodemailerTransport.sendMail(mailOptions);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }



   async createSceduleEmail(to: string, templateName: string, context: NotificationContext, date: Date) {
    console.log(to)
    const task = this.taskRepository.create({ to, templateName, context, date });
    console.log(task)
    return this.taskRepository.save(task);
  }

  async processPendingEmails() {
    const now = new Date();
    const tasks = await this.taskRepository.find({ where: { date: LessThanOrEqual(now), isSent: false } });

    for (const task of tasks) {
      await this.sendEmail(task.to, EmailMessages[task.templateName.toUpperCase()], task.context);
      task.isSent = true;
      await this.taskRepository.save(task);
    }
  }


  private loadTemplate(templateName: string): Handlebars.TemplateDelegate {
    const filePath = join(__dirname, '..', 'static/templates', `${templateName}.hbs`);
    const templateSource = readFileSync(filePath, 'utf8');
    return Handlebars.compile(templateSource, {preventIndent:true});
  }

  private getSubjectByTemplateType(templateType: EmailMessages): string {
    switch (templateType) {
      case EmailMessages.REMIND:
        return 'Reminder: Your upcoming flight';
      case EmailMessages.UPDATE:
        return 'Train Status Update';
      case EmailMessages.CANCEL:
        return "Your train was cancelled"
      default:
        return 'Notification';
    }
  }
}