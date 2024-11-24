import { useEffect } from 'react';

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; 
        console.log('base url: ', apiBaseUrl)
        const token = "PQj1g-HvR43VMbp_pQs8m-e8AHYr-huh6de4OwR-f90"
        const response = await fetch(`${apiBaseUrl}/coaches`, {
          method: 'GET', // or 'POST' if you're making a POST request
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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