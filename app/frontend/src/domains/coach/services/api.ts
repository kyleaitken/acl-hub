export const apiRequest = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  token: string,
  body?: any,
) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  console.log('response for: ', url, data);
  return data;
};
