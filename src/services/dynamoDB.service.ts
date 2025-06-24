import { DynamoDB } from 'aws-sdk';
import { Appointment } from '../core/entities/Appointment';

const dynamoDbClient = process.env.IS_OFFLINE
  ? new DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
  : new DynamoDB.DocumentClient();

const tableName = `Appointments-${process.env.STAGE || 'dev'}`;

export class DynamoDBService {
    async saveAppointment(appointment: Appointment): Promise<void> {
        const params = {
            TableName: tableName,
            Item: appointment,
        };
        await dynamoDbClient.put(params).promise();
    }

    async updateAppointmentStatus(appointmentId: string, status: string): Promise<void> {
        const params = {
            TableName: tableName,
            Key: { appointmentId },
            UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'UPDATED_NEW'
        };
        await dynamoDbClient.update(params).promise();
    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {
        const params = {
            TableName: tableName,
            IndexName: 'InsuredIdIndex',
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId,
            },
        };
        const result = await dynamoDbClient.query(params).promise();
        return (result.Items as Appointment[]) || [];
    }
}