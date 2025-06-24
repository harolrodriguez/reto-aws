import { SQSEvent } from 'aws-lambda';
import { DynamoDBService } from '../services/dynamoDB.service';

const dynamoService = new DynamoDBService();

export const handler = async (event: SQSEvent): Promise<void> => {
    for (const record of event.Records) {
        try {
            const eventDetail = JSON.parse(record.body).detail;
            const { appointmentId, status } = eventDetail;
            await dynamoService.updateAppointmentStatus(appointmentId, status);
        } catch (error) {
            throw error;
        }
    }
};