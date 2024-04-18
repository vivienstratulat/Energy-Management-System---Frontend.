import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SeeGraph = () => {
  const { deviceId } = useParams();
  const [chartData, setChartData] = useState({ datasets: [] });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (selectedDate) {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await axios.get(`http://localhost:8086/api/measures/${deviceId}`, {
            params: { date: formattedDate }
          });

          console.log("Formated date:", formattedDate);
          const data = response.data;
          const processedData = processChartData(data);
          console.log('Raw data:', data);
          console.log('Processed data:', processedData);
          setChartData(processedData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [deviceId, selectedDate]);

  const processChartData = (data) => {
    console.log('Raw data:', data);
  
    if (!data || !Array.isArray(data.yvalues) || !Array.isArray(data.xvalues)) {
      console.error('Invalid data format:', data);
      setError('Invalid data format. Please try again.');
      return { datasets: [] };
    }
  
    const processedData = {
      labels: data.xvalues.map((x) => `Hour ${x}`),
      datasets: [
        {
          label: 'Energy Consumption (kWh)',
          data: data.yvalues,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          lineTension: 0.1
        }
      ]
    };
  
    console.log('Processed data:', processedData);
    return processedData;
  };
  

  return (
    <div>
      <h2>Daily Energy Consumption Chart</h2>
      <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && chartData.datasets.length > 0 && <Line data={chartData} />}
    </div>
  );
};

export default SeeGraph;
