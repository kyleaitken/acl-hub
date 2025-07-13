import { ProgramTag } from '../types';
import { apiRequest } from '../../core/api/api';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/coaches/tags`;

const fetchTags = (token: string): Promise<ProgramTag[]> =>
  apiRequest(`${baseUrl}`, 'GET', token);

const addTag = (token: string, tagName: string): Promise<ProgramTag> => {
  const body = {
    name: tagName,
  };
  return apiRequest(baseUrl, 'POST', token, body);
};

export const deleteTag = async (token: string, tagId: number) => {
  const url = `${baseUrl}/${tagId}`;
  return apiRequest(url, 'DELETE', token);
};

export const updateTag = async (
  token: string,
  tagId: number,
  newName: string,
): Promise<ProgramTag> => {
  const url = `${baseUrl}/${tagId}`;
  const body = {
    name: newName,
  };
  return apiRequest(url, 'PUT', token, body);
};

export default {
  fetchTags,
  addTag,
  deleteTag,
  updateTag,
};
