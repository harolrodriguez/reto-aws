import { SNS } from 'aws-sdk';
import { Appointment } from '../core/entities/Appointment';

const snsClient = new SNS();

export class SnsService {
    async publishAppointment(appointment: Appointment): Promise<void> {
        const topicArn = `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:AppointmentTopic-${process.env.STAGE}`;

        if (process.env.IS_OFFLINE) {
            return;
        }

        const params: SNS.PublishInput = {
            TopicArn: topicArn,
            Message: JSON.stringify(appointment),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: appointment.countryISO,
                },
            },
        };
        await snsClient.publish(params).promise();
    }
}