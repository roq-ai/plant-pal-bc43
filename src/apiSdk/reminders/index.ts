import axios from 'axios';
import queryString from 'query-string';
import { ReminderInterface, ReminderGetQueryInterface } from 'interfaces/reminder';
import { GetQueryInterface } from '../../interfaces';

export const getReminders = async (query?: ReminderGetQueryInterface) => {
  const response = await axios.get(`/api/reminders${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createReminder = async (reminder: ReminderInterface) => {
  const response = await axios.post('/api/reminders', reminder);
  return response.data;
};

export const updateReminderById = async (id: string, reminder: ReminderInterface) => {
  const response = await axios.put(`/api/reminders/${id}`, reminder);
  return response.data;
};

export const getReminderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/reminders/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteReminderById = async (id: string) => {
  const response = await axios.delete(`/api/reminders/${id}`);
  return response.data;
};
