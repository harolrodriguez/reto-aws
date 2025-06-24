export interface Appointment {
  appointmentId: string;
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}