import axios, { AxiosInstance } from 'axios'

export const apiRequest = async (url: string) => {
  const token = localStorage.getItem('jwt');

  if (!token) {
    throw new Error('Token não encontrado, por favor faça login.');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Erro ao fazer requisição: ' + error.message);
  }
};
