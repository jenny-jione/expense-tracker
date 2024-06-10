// useFetchData.js
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const useFetchData = (csvUrl) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(csvUrl)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const formattedData = result.data
              .filter(row => Object.values(row).some(value => value.trim() !== ''))
              .map(row => ({
                month: row.Month,
                category: row.Category,
                amount: parseFloat(row.Amount),
              }));
            setData(formattedData);
          },
          error: (error) => {
            console.error('Parsing error:', error);
            setError('Failed to parse CSV data.');
          }
        });
      })
      .catch(error => {
        console.error('Error fetching the CSV file:', error);
        setError('Failed to fetch CSV file.');
      });
  }, [csvUrl]);

  return { data, error };
};

export default useFetchData;
