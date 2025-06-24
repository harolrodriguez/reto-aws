import { EventBridge } from 'aws-sdk';
const eventBridgeClient = new EventBridge();

export class EventBridgeService {
    async publishCompletion(appointmentId: string, status: 'completed' | 'failed') {
        if (process.env.IS_OFFLINE) {
            return;
        }

        const params: EventBridge.PutEventsRequest = {
            Entries: [
                {
                    Source: 'com.appointment.processing',
                    DetailType: 'Appointment Processed',
                    Detail: JSON.stringify({ appointmentId, status }),
                    EventBusName: 'default',
                },
            ],
        };
        await eventBridgeClient.putEvents(params).promise();
    }
}