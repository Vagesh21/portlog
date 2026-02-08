import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  Settings as SettingsIcon,
  Mail,
  Edit,
  Save,
  Trash2,
  Plus,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { 
  Users, 
  MousePointer, 
  Eye, 
  TrendingUp,
  Calendar,
  Globe,
  Monitor
} from 'lucide-react';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [contactMessages, setContactMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [settings, setSettings] = useState({});
  
  // Analytics states
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

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API}/analytics/stats?time_range=7d`);
        const data = await response.json();
        
        setStats({
          totalVisits: data.total_visits,
          totalClicks: data.total_clicks,
          uniqueVisitors: data.unique_visitors,
          avgSessionTime: data.avg_session_time
        });
        
        setVisitData(data.visit_data || []);
        setRecentVisitors(data.recent_visitors || []);
        setPageViews(data.page_views || []);
        setDeviceStats(data.device_stats || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (activeTab === 'analytics') {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Fetch contact messages
  const fetchContactMessages = async () => {
    try {
      const response = await fetch(`${API}/contact/list`);
      const data = await response.json();
      setContactMessages(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch content
  const fetchContent = async () => {
    try {
      const [projRes, skillsRes, settingsRes] = await Promise.all([
        fetch(`${API}/content/projects`),
        fetch(`${API}/content/skills`),
        fetch(`${API}/content/settings`)
      ]);

      const projData = await projRes.json();
      const skillsData = await skillsRes.json();
      const settingsData = await settingsRes.json();

      setProjects(projData.projects || []);
      setSkills(skillsData.skills || []);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchContactMessages();
    } else if (activeTab === 'content') {
      fetchContent();
    }
  }, [activeTab]);

  // Mark message as read
  const markAsRead = async (contactId) => {
    try {
      await fetch(`${API}/contact/${contactId}/read`, { method: 'PATCH' });
      toast({ title: "Marked as read" });
      fetchContactMessages();
    } catch (error) {
      toast({ title: "Error", description: "Failed to mark as read", variant: "destructive" });
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`${API}/content/projects/${projectId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Project deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  };

  const COLORS = ['#00d4ff', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-[#0a0e27] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2 flex items-center gap-3">
                <SettingsIcon className="text-[#00d4ff]" size={36} />
                Admin Control Panel
              </h1>
              <p className="text-[#9ca3af]">Manage your portfolio content and analytics</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-[#9ca3af] hover:text-[#00d4ff]"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Site
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a1f3a]/50 border border-[#2a3150] mb-8 p-1">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
            >
              <BarChart3 size={16} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
            >
              <Mail size={16} className="mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
            >
              <Edit size={16} className="mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
            >
              <SettingsIcon size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Eye className="text-[#00d4ff]" size={32} />
                    <span className="text-[#10b981] text-sm font-semibold">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.totalVisits}</div>
                  <div className="text-[#9ca3af] text-sm">Total Visits</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MousePointer className="text-[#10b981]" size={32} />
                    <span className="text-[#10b981] text-sm font-semibold">+8%</span>
                  </div>
                  <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.totalClicks}</div>
                  <div className="text-[#9ca3af] text-sm">Total Clicks</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="text-[#f59e0b]" size={32} />
                    <span className="text-[#10b981] text-sm font-semibold">+15%</span>
                  </div>
                  <div className="text-3xl font-bold text-[#e5e7eb] mb-1">{stats.uniqueVisitors}</div>
                  <div className="text-[#9ca3af] text-sm">Unique Visitors</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
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

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:col-span-2">
                <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-6">
                  <h3 className="text-xl font-bold text-[#e5e7eb] mb-4">Recent Visitors</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {recentVisitors.map((visitor, index) => (
                      <div key={index} className="p-4 bg-[#0a0e27]/50 rounded-lg border border-[#2a3150] hover:border-[#00d4ff]/30 transition-all">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                              <span className="text-sm text-[#e5e7eb] font-mono">{visitor.ip}</span>
                            </div>
                            <div className="text-xs text-[#6b7280]">{visitor.timestamp}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-[#00d4ff] mb-1">{visitor.device}</div>
                            <div className="text-xs text-[#9ca3af]">{visitor.browser || 'Unknown'}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-[#9ca3af] mb-1">Page:</div>
                            <div className="text-xs text-[#e5e7eb] truncate">{visitor.page}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-[#9ca3af] mb-1">OS:</div>
                            <div className="text-xs text-[#e5e7eb]">{visitor.os || 'Unknown'}</div>
                          </div>
                          
                          {visitor.location && (
                            <div className="col-span-2">
                              <div className="text-xs text-[#9ca3af] mb-1">Location:</div>
                              <div className="text-xs text-[#10b981]">{visitor.location}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#e5e7eb]">Contact Messages</h2>
                <Button 
                  onClick={fetchContactMessages}
                  className="bg-[#1a1f3a] hover:bg-[#2a3150] border border-[#2a3150]"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </Button>
              </div>
              
              {contactMessages.length === 0 ? (
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-12 text-center">
                  <Mail className="mx-auto text-[#6b7280] mb-4" size={48} />
                  <p className="text-[#9ca3af]">No messages yet</p>
                </Card>
              ) : (
                contactMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`bg-[#1a1f3a]/50 border-[#2a3150] p-6 ${
                      msg.read ? 'opacity-60' : ''
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#e5e7eb]">{msg.name}</h3>
                          <p className="text-sm text-[#00d4ff]">{msg.email}</p>
                          <p className="text-xs text-[#6b7280] mt-1">
                            {new Date(msg.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!msg.read && (
                          <Button
                            size="sm"
                            onClick={() => markAsRead(msg.id)}
                            className="bg-[#10b981] hover:bg-[#059669]"
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      <p className="text-[#9ca3af] whitespace-pre-wrap">{msg.message}</p>
                      {msg.ip_address && (
                        <p className="text-xs text-[#6b7280] mt-4">IP: {msg.ip_address}</p>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">Projects</h2>
                  <Button className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                    <Plus size={16} className="mr-2" />
                    Add Project
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#e5e7eb] mb-2">{project.title}</h3>
                          <p className="text-sm text-[#9ca3af] mb-2">{project.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            {project.technologies?.map((tech, i) => (
                              <span key={i} className="text-xs bg-[#00d4ff]/10 text-[#00d4ff] px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-[#00d4ff] hover:bg-[#00d4ff]/10">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-[#ef4444] hover:bg-[#ef4444]/10"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">Skills</h2>
                  <Button className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                    <Plus size={16} className="mr-2" />
                    Add Skill
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <Card key={index} className="bg-[#1a1f3a]/50 border-[#2a3150] p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-[#e5e7eb] font-semibold">{skill.category}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-[#2a3150] rounded-full h-2">
                              <div 
                                className="bg-[#00d4ff] h-2 rounded-full transition-all"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#9ca3af]">{skill.level}%</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10 ml-4">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
              <h2 className="text-2xl font-bold text-[#e5e7eb] mb-6">Website Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#9ca3af] mb-2 block">
                    Theme Color
                  </label>
                  <Input 
                    type="color" 
                    defaultValue={settings.theme_color || '#00d4ff'}
                    className="w-32 h-12 bg-[#0a0e27] border-[#2a3150]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={settings.enable_analytics !== false}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Analytics Tracking</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={settings.enable_contact_form !== false}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Contact Form</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={settings.enable_threat_map !== false}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Threat Map</span>
                  </label>
                </div>

                <Button className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                  <Save size={16} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
