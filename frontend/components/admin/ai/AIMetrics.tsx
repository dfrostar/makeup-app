import { useEffect, useState } from 'react';
import { UnifiedAIService } from '@/lib/ai/UnifiedAIService';
import { PerformanceMetrics } from '@/lib/ai/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AIMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      const aiService = UnifiedAIService.getInstance();
      const currentMetrics = await aiService.getPerformanceMetrics();
      const historical = await aiService.getHistoricalMetrics(timeRange);
      
      setMetrics(currentMetrics);
      setHistoricalData(historical);
    } catch (error) {
      console.error('Error loading AI metrics:', error);
    }
  };

  if (!metrics || !historicalData) {
    return <div>Loading metrics...</div>;
  }

  const chartData = {
    labels: historicalData.timestamps,
    datasets: [
      {
        label: 'Content Quality',
        data: historicalData.contentQuality,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Recommendation Accuracy',
        data: historicalData.recommendationAccuracy,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'AI Performance Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['24h', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`
              px-3 py-1 rounded-md text-sm font-medium
              ${timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Content Quality"
          value={metrics.contentQuality}
          change={metrics.contentQualityChange}
        />
        <MetricCard
          label="Recommendation Accuracy"
          value={metrics.recommendationAccuracy}
          change={metrics.recommendationAccuracyChange}
        />
        <MetricCard
          label="Processing Time"
          value={metrics.averageProcessingTime}
          change={metrics.processingTimeChange}
          format="ms"
        />
        <MetricCard
          label="Cache Hit Rate"
          value={metrics.cacheHitRate}
          change={metrics.cacheHitRateChange}
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Error Rates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Error Rates</h3>
          <div className="space-y-4">
            {Object.entries(metrics.errorRates).map(([type, rate]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600">{type}</span>
                <span className="font-medium">{(rate * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Memory Usage</span>
              <span className="font-medium">{metrics.systemHealth.memoryUsage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CPU Load</span>
              <span className="font-medium">{metrics.systemHealth.cpuLoad}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Response Time</span>
              <span className="font-medium">{metrics.systemHealth.apiResponseTime}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, format = 'percentage' }: {
  label: string;
  value: number;
  change: number;
  format?: 'percentage' | 'ms';
}) {
  const formattedValue = format === 'percentage'
    ? `${(value * 100).toFixed(1)}%`
    : `${value.toFixed(1)}ms`;

  const changeColor = change > 0 ? 'text-green-600' : 'text-red-600';
  const changeArrow = change > 0 ? '↑' : '↓';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold mb-2">{formattedValue}</div>
      <div className={`text-sm ${changeColor}`}>
        {changeArrow} {Math.abs(change * 100).toFixed(1)}%
      </div>
    </div>
  );
}
