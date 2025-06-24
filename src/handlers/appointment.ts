import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { DynamoDBService } from '../services/dynamoDB.service';
import { SnsService } from '../services/sns.service';
import { Appointment } from '../core/entities/Appointment';

const dynamoService = new DynamoDBService();
const snsService = new SnsService();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod === 'POST') {
            return createAppointment(event);
        }
        if (event.httpMethod === 'GET') {
            return getAppointments(event);
        }
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};

const createAppointment = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body || '{}');
    const { insuredId, scheduleId, countryISO } = body;

    if (!insuredId || !scheduleId || !['PE', 'CL'].includes(countryISO)) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid or missing parameters.' }) };
    }

    const newAppointment: Appointment = {
        appointmentId: uuid(),
        insuredId, scheduleId, countryISO,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await dynamoService.saveAppointment(newAppointment);
    await snsService.publishAppointment(newAppointment);

    return {
        statusCode: 202,
        body: JSON.stringify({ message: 'Appointment request received.', appointmentId: newAppointment.appointmentId }),
    };
};

const getAppointments = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const insuredId = event.pathParameters?.insuredId;
    if (!insuredId) {
        return { statusCode: 400, body: JSON.stringify({ message: 'insuredId is required.' }) };
    }

    const appointments = await dynamoService.getAppointmentsByInsuredId(insuredId);
    return {
        statusCode: 200,
        body: JSON.stringify(appointments),
    };
};