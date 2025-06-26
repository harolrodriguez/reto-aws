import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../handlers/appointment';
import { DynamoDBService } from '../../services/dynamoDB.service';
import { SnsService } from '../../services/sns.service';
import { Appointment } from '../../core/entities/Appointment';

const saveAppointmentSpy = jest.spyOn(DynamoDBService.prototype, 'saveAppointment').mockResolvedValue(undefined);
const getAppointmentsSpy = jest.spyOn(DynamoDBService.prototype, 'getAppointmentsByInsuredId');
const publishAppointmentSpy = jest.spyOn(SnsService.prototype, 'publishAppointment').mockResolvedValue(undefined);

describe('Appointment API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creating a new appointment', () => {
    it('should work correctly with valid data', async () => {
      const mockEvent: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        body: JSON.stringify({ insuredId: '12345', scheduleId: 101, countryISO: 'PE' }),
      };

      const result = await handler(mockEvent as APIGatewayProxyEvent);

      expect(result.statusCode).toBe(202);
      expect(saveAppointmentSpy).toHaveBeenCalledTimes(1);
      expect(publishAppointmentSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an error if data is missing', async () => {
      const mockEvent: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'POST',
        body: JSON.stringify({ insuredId: '12345' }),
      };

      const result = await handler(mockEvent as APIGatewayProxyEvent);

      expect(result.statusCode).toBe(400);
      expect(saveAppointmentSpy).not.toHaveBeenCalled();
    });
  });

  describe('Getting existing appointments', () => {
    it('should return a list of appointments for an insured person', async () => {
      const mockAppointments: Appointment[] = [{ 
          appointmentId: 'test-uuid-123', 
          insuredId: '54321', 
          status: 'pending', 
          countryISO: 'CL', 
          scheduleId: 202, 
          createdAt: '2024-01-01T00:00:00Z', 
          updatedAt: '2024-01-01T00:00:00Z' 
      }];
      getAppointmentsSpy.mockResolvedValue(mockAppointments);

      const mockEvent: Partial<APIGatewayProxyEvent> = {
        httpMethod: 'GET',
        pathParameters: { insuredId: '54321' },
      };

      const result = await handler(mockEvent as APIGatewayProxyEvent);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual(mockAppointments);
      expect(getAppointmentsSpy).toHaveBeenCalledWith('54321');
    });

    it('should return an error if the insuredId is not in the URL', async () => {
        const mockEvent: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            pathParameters: {},
        };

        const result = await handler(mockEvent as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
    });
  });
});