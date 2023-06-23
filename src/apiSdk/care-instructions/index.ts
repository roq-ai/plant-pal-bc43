import axios from 'axios';
import queryString from 'query-string';
import { CareInstructionInterface, CareInstructionGetQueryInterface } from 'interfaces/care-instruction';
import { GetQueryInterface } from '../../interfaces';

export const getCareInstructions = async (query?: CareInstructionGetQueryInterface) => {
  const response = await axios.get(`/api/care-instructions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCareInstruction = async (careInstruction: CareInstructionInterface) => {
  const response = await axios.post('/api/care-instructions', careInstruction);
  return response.data;
};

export const updateCareInstructionById = async (id: string, careInstruction: CareInstructionInterface) => {
  const response = await axios.put(`/api/care-instructions/${id}`, careInstruction);
  return response.data;
};

export const getCareInstructionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/care-instructions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCareInstructionById = async (id: string) => {
  const response = await axios.delete(`/api/care-instructions/${id}`);
  return response.data;
};
