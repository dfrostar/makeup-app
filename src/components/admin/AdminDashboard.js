import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: {},
    bookings: {},
    professionals: {},
    services: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const revenueData = {
    labels: stats.revenue?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats.revenue?.data || [],
        fill: false,
        borderColor: '#FF69B4',
        tension: 0.4
      }
    ]
  };

  const bookingsData = {
    labels: stats.bookings?.labels || [],
    datasets: [
      {
        label: 'Bookings',
        data: stats.bookings?.data || [],
        backgroundColor: '#FFB6C1'
      }
    ]
  };

  const servicesData = {
    labels: stats.services?.labels || [],
    datasets: [
      {
        data: stats.services?.data || [],
        backgroundColor: [
          '#FF69B4',
          '#FFB6C1',
          '#FF1493',
          '#DB7093',
          '#FFC0CB'
        ]
      }
    ]
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Beauty Directory Admin</h1>
        <div className="quick-stats">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>${stats.revenue?.total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Professionals</h3>
            <p>{stats.professionals?.active || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Bookings</h3>
            <p>{stats.bookings?.today || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Conversion Rate</h3>
            <p>{stats.bookings?.conversionRate || 0}%</p>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h2>Revenue Trends</h2>
          <Line data={revenueData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Revenue'
              }
            }
          }} />
        </div>

        <div className="chart-card">
          <h2>Booking Analytics</h2>
          <Bar data={bookingsData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Weekly Bookings'
              }
            }
          }} />
        </div>

        <div className="chart-card">
          <h2>Popular Services</h2>
          <Doughnut data={servicesData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Service Distribution'
              }
            }
          }} />
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats.recentActivity?.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-type">{activity.type}</span>
                <span className="activity-description">{activity.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
