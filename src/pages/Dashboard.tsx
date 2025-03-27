import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line, Bar, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ChartCard } from '../components/ChartCard';
import { StatCard } from '../components/StatCard';
import type { City, AirQualityData } from '../types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

const cities: City[] = [
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { name: 'Rome', lat: 41.9028, lon: 12.4964 },
];

const chartConfigs = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9ca3af',
        boxWidth: 10,
        padding: 10,
      },
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(75, 85, 99, 0.2)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    r: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9ca3af',
        backdropColor: 'transparent',
      },
      pointLabels: {
        color: '#9ca3af',
      },
    },
  },
};

function Dashboard() {
  const [selectedCity, setSelectedCity] = React.useState<City>(cities[0]);
  const [timeRange, setTimeRange] = React.useState<'24h' | '48h' | '72h'>('24h');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['airQuality', selectedCity, timeRange],
    queryFn: async () => {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi`
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json() as Promise<AirQualityData>;
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get data slice based on time range
  const timeSlice = useMemo(() => {
    if (!data) return null;
    const hours = parseInt(timeRange);
    return {
      time: data.hourly.time.slice(0, hours),
      pm2_5: data.hourly.pm2_5.slice(0, hours),
      pm10: data.hourly.pm10.slice(0, hours),
      carbon_monoxide: data.hourly.carbon_monoxide.slice(0, hours),
      nitrogen_dioxide: data.hourly.nitrogen_dioxide.slice(0, hours),
      sulphur_dioxide: data.hourly.sulphur_dioxide.slice(0, hours),
      ozone: data.hourly.ozone.slice(0, hours),
      european_aqi: data.hourly.european_aqi.slice(0, hours),
    };
  }, [data, timeRange]);

  // Calculate averages for the selected time range
  const averages = useMemo(() => {
    if (!timeSlice) return null;
    return {
      pm2_5: timeSlice.pm2_5.reduce((a, b) => a + b, 0) / timeSlice.pm2_5.length,
      pm10: timeSlice.pm10.reduce((a, b) => a + b, 0) / timeSlice.pm10.length,
      co: timeSlice.carbon_monoxide.reduce((a, b) => a + b, 0) / timeSlice.carbon_monoxide.length,
      no2: timeSlice.nitrogen_dioxide.reduce((a, b) => a + b, 0) / timeSlice.nitrogen_dioxide.length,
      so2: timeSlice.sulphur_dioxide.reduce((a, b) => a + b, 0) / timeSlice.sulphur_dioxide.length,
      o3: timeSlice.ozone.reduce((a, b) => a + b, 0) / timeSlice.ozone.length,
    };
  }, [timeSlice]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !data || !timeSlice || !averages) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">Failed to load air quality data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar
        selectedCity={selectedCity}
        cities={cities}
        onCityChange={setSelectedCity}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Air Quality Dashboard</h1>
            <p className="text-gray-400">Real-time monitoring for {selectedCity.name}</p>
          </div>
          <div className="flex gap-2">
            {(['24h', '48h', '72h'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-xl'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Current AQI"
            value={timeSlice.european_aqi[0]}
            trend={-5}
          />
          <StatCard
            label="PM2.5"
            value={timeSlice.pm2_5[0].toFixed(1)}
            unit="µg/m³"
            trend={2}
          />
          <StatCard
            label="PM10"
            value={timeSlice.pm10[0].toFixed(1)}
            unit="µg/m³"
            trend={-3}
          />
          <StatCard
            label="Ozone"
            value={timeSlice.ozone[0].toFixed(1)}
            unit="µg/m³"
            trend={7}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartCard title="AQI Timeline" className="lg:col-span-3">
            <Line
              data={{
                labels: timeSlice.time.map(time => format(new Date(time), 'HH:mm')),
                datasets: [{
                  label: 'European AQI',
                  data: timeSlice.european_aqi,
                  borderColor: 'rgb(99, 102, 241)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  fill: true,
                  tension: 0.4,
                }],
              }}
              options={chartConfigs}
            />
          </ChartCard>

          <ChartCard title="Pollutant Distribution">
            <Radar
              data={{
                labels: ['PM2.5', 'PM10', 'CO', 'NO₂', 'SO₂', 'O₃'],
                datasets: [{
                  label: `${timeRange} Average`,
                  data: [
                    averages.pm2_5,
                    averages.pm10,
                    averages.co,
                    averages.no2,
                    averages.so2,
                    averages.o3,
                  ],
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  borderColor: 'rgb(99, 102, 241)',
                  pointBackgroundColor: 'rgb(99, 102, 241)',
                  pointBorderColor: '#fff',
                }],
              }}
              options={{
                ...chartConfigs,
                scales: {
                  r: chartConfigs.scales.r,
                },
              }}
            />
          </ChartCard>

          <ChartCard title="Pollutant Comparison">
            <PolarArea
              data={{
                labels: ['PM2.5', 'PM10', 'CO', 'NO₂', 'SO₂', 'O₃'],
                datasets: [{
                  data: [
                    timeSlice.pm2_5[0],
                    timeSlice.pm10[0],
                    timeSlice.carbon_monoxide[0],
                    timeSlice.nitrogen_dioxide[0],
                    timeSlice.sulphur_dioxide[0],
                    timeSlice.ozone[0],
                  ],
                  backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(244, 114, 182, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(34, 197, 94, 0.7)',
                  ],
                }],
              }}
              options={chartConfigs}
            />
          </ChartCard>

          <ChartCard title="PM2.5 vs PM10">
            <Bar
              data={{
                labels: timeSlice.time.map(time => format(new Date(time), 'HH:mm')),
                datasets: [
                  {
                    label: 'PM2.5',
                    data: timeSlice.pm2_5,
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                  },
                  {
                    label: 'PM10',
                    data: timeSlice.pm10,
                    backgroundColor: 'rgba(244, 114, 182, 0.5)',
                  },
                ],
              }}
              options={chartConfigs}
            />
          </ChartCard>

          <ChartCard title="Gas Pollutants">
            <Line
              data={{
                labels: timeSlice.time.map(time => format(new Date(time), 'HH:mm')),
                datasets: [
                  {
                    label: 'NO₂',
                    data: timeSlice.nitrogen_dioxide,
                    borderColor: 'rgb(239, 68, 68)',
                    tension: 0.4,
                  },
                  {
                    label: 'SO₂',
                    data: timeSlice.sulphur_dioxide,
                    borderColor: 'rgb(234, 179, 8)',
                    tension: 0.4,
                  },
                  {
                    label: 'O₃',
                    data: timeSlice.ozone,
                    borderColor: 'rgb(34, 197, 94)',
                    tension: 0.4,
                  },
                ],
              }}
              options={chartConfigs}
            />
          </ChartCard>

          <ChartCard title="Latest Pollutant Concentrations" className="lg:col-span-3">
            <div className="h-[400px] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="sticky top-0 bg-gray-800 z-10">
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 whitespace-nowrap">Time</th>
                      <th className="py-3 px-4 whitespace-nowrap">PM2.5</th>
                      <th className="py-3 px-4 whitespace-nowrap">PM10</th>
                      <th className="py-3 px-4 whitespace-nowrap">CO</th>
                      <th className="py-3 px-4 whitespace-nowrap">NO₂</th>
                      <th className="py-3 px-4 whitespace-nowrap">SO₂</th>
                      <th className="py-3 px-4 whitespace-nowrap">O₃</th>
                      <th className="py-3 px-4 whitespace-nowrap">AQI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlice.time.map((time, index) => (
                      <tr key={time} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-2 px-4 whitespace-nowrap">{format(new Date(time), 'HH:mm')}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.pm2_5[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.pm10[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.carbon_monoxide[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.nitrogen_dioxide[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.sulphur_dioxide[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.ozone[index].toFixed(1)}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{timeSlice.european_aqi[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;