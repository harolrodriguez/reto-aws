import { SQSEvent } from 'aws-lambda';
import { EventBridgeService } from '../services/eventBridge.service';
import { RdsService } from '../services/rds.service';
import { Appointment } from '../core/entities/Appointment';

const eventBridgeService = new EventBridgeService();
const rdsService = new RdsService();

export const handler = async (event: SQSEvent): Promise<void> => {
    for (const record of event.Records) {
        try {
            const snsMessage = JSON.parse(record.body);
            const appointment: Appointment = JSON.parse(snsMessage.Message);
            
            await rdsService.saveAppointmentConfirmation(appointment);
            await eventBridgeService.publishCompletion(appointment.appointmentId, 'completed');
        } catch (error) {
            throw error;
        }
    }
};