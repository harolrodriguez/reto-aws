import mysql from 'mysql2/promise';
import { Appointment } from '../core/entities/Appointment';

let connectionPool: mysql.Pool | null = null;

const getDbNameForCountry = (countryISO: 'PE' | 'CL'): string => {
    return countryISO === 'PE' ? process.env.RDS_DB_NAME_PE! : process.env.RDS_DB_NAME_CL!;
};

const initializePool = () => {
    if (connectionPool || !process.env.RDS_HOST) {
        return;
    }

    const config: mysql.PoolOptions = {
        host: process.env.RDS_HOST,
        user: process.env.RDS_USER,
        password: process.env.RDS_PASSWORD,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0,
    };
    connectionPool = mysql.createPool(config);
};

initializePool();

export class RdsService {
    async saveAppointmentConfirmation(appointment: Appointment): Promise<void> {
        if (process.env.IS_OFFLINE || !process.env.RDS_HOST) {
            return;
        }

        try {
            const dbName = getDbNameForCountry(appointment.countryISO);
            const sql = `INSERT INTO \`${dbName}\`.\`appointments\` (appointment_request_id, insured_id, schedule_id, created_at) VALUES (?, ?, ?, ?)`;
            const values = [appointment.appointmentId, appointment.insuredId, appointment.scheduleId, new Date(appointment.createdAt)];
            
            await connectionPool!.execute(sql, values);
        } catch (error) {
            throw new Error('RDS save failed');
        }
    }
}