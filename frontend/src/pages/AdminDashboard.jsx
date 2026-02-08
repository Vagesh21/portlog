import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MousePointer, 
  Eye, 
  TrendingUp,
  Calendar,
  Globe,
  Monitor,
  BarChart3
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  // Mock analytics data (will be replaced with real backend data)
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
    avgSessionTime: '0m 0s'
  });

  const [visitData, setVisitData] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);

  useEffect(() => {
    // Mock data - will be fetched from backend
    setStats({
      totalVisits: 1247,
      totalClicks: 3891,
      uniqueVisitors: 892,
      avgSessionTime: '3m 42s'
    });

    setVisitData([
      { date: 'Mon', visits: 45, clicks: 120 },
      { date: 'Tue', visits: 52, clicks: 150 },
      { date: 'Wed', visits: 38, clicks: 95 },
      { date: 'Thu', visits: 67, clicks: 180 },
      { date: 'Fri', visits: 71, clicks: 210 },
      { date: 'Sat', visits: 43, clicks: 130 },
      { date: 'Sun', visits: 55, clicks: 165 }
    ]);

    setRecentVisitors([
      { ip: '203.45.67.89', timestamp: '2 mins ago', page: '/projects', device: 'Desktop' },
      { ip: '192.168.1.105', timestamp: '5 mins ago', page: '/contact', device: 'Mobile' },
      { ip: '104.23.45.167', timestamp: '8 mins ago', page: '/certifications', device: 'Tablet' },
      { ip: '75.89.123.45', timestamp: '12 mins ago', page: '/', device: 'Desktop' },
      { ip: '88.56.234.12', timestamp: '15 mins ago', page: '/projects', device: 'Mobile' }
    ]);

    setPageViews([
      { page: 'Home', views: 420 },
      { page: 'Projects', views: 280 },
      { page: 'Certifications', views: 195 },
      { page: 'Contact', views: 145 },
      { page: 'About', views: 207 }
    ]);

    setDeviceStats([
      { name: 'Desktop', value: 55 },
      { name: 'Mobile', value: 32 },
      { name: 'Tablet', value: 13 }
    ]);
  }, []);

  const COLORS = ['#00d4ff', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-[#0a0e27] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2 flex items-center gap-3">
            <BarChart3 className="text-[#00d4ff]" size={36} />
            Analytics Dashboard
          </h1>
          <p className="text-[#9ca3af]">Real-time website analytics and visitor tracking</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="text-[#00d4ff]" size={32} />
                <span className="text-[#10b981] text-sm font-semibold">+12%</span>
              </div>
              <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.totalVisits}</div>
              <div className="text-[#9ca3af] text-sm">Total Visits</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <div className="flex items-center justify-between mb-4">
                <MousePointer className="text-[#10b981]" size={32} />
                <span className="text-[#10b981] text-sm font-semibold">+8%</span>
              </div>
              <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.totalClicks}</div>
              <div className="text-[#9ca3af] text-sm">Total Clicks</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-[#f59e0b]" size={32} />
                <span className="text-[#10b981] text-sm font-semibold">+15%</span>
              </div>
              <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.uniqueVisitors}</div>
              <div className="text-[#9ca3af] text-sm">Unique Visitors</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-[#06b6d4]" size={32} />
                <span className="text-[#10b981] text-sm font-semibold">+5%</span>
              </div>
              <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.avgSessionTime}</div>
              <div className="text-[#9ca3af] text-sm">Avg. Session Time</div>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visits & Clicks Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <h3 className="text-xl font-bold text-[#e5e7eb] mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[#00d4ff]" />
                Weekly Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={visitData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3150" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2a3150',
                      borderRadius: '8px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#00d4ff" fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" dataKey="clicks" stroke="#10b981" fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Page Views Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <h3 className="text-xl font-bold text-[#e5e7eb] mb-4 flex items-center gap-2">
                <Globe size={20} className="text-[#10b981]" />
                Page Views
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3150" />
                  <XAxis dataKey="page" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2a3150',
                      borderRadius: '8px',
                      color: '#e5e7eb'
                    }}
                  />
                  <Bar dataKey="views" fill="#00d4ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <h3 className="text-xl font-bold text-[#e5e7eb] mb-4 flex items-center gap-2">
                <Monitor size={20} className="text-[#f59e0b]" />
                Device Types
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Recent Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
              <h3 className="text-xl font-bold text-[#e5e7eb] mb-4">Recent Visitors</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {recentVisitors.map((visitor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#0a0e27]/50 rounded-lg border border-[#2a3150]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm text-[#e5e7eb] font-mono">{visitor.ip}</div>
                        <div className="text-xs text-[#6b7280]">{visitor.page}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#9ca3af]">{visitor.timestamp}</div>
                      <div className="text-xs text-[#00d4ff]">{visitor.device}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;