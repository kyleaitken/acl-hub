import { useEffect } from 'react';

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; 
        console.log('base url: ', apiBaseUrl)
        const response = await fetch(`${apiBaseUrl}/coaches`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the data to the console
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <div>Check the console for fetched data!</div>;
};

export default TestComponent;