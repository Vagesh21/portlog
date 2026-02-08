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
  ArrowLeft,
  LogOut,
  Key,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  X
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
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Content states
  const [personalInfo, setPersonalInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [settings, setSettings] = useState({});
  const [contentLoading, setContentLoading] = useState(false);
  
  // Edit modal states
  const [editModal, setEditModal] = useState({ open: false, type: '', data: null });
  
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

  // Fetch all content
  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const response = await fetch(`${API}/content/all`);
      const data = await response.json();
      
      setPersonalInfo(data.personal_info || null);
      setProjects(data.projects || []);
      setSkills(data.skills || []);
      setCertifications(data.certifications || []);
      setExperience(data.experience || []);
      setEducation(data.education || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({ title: "Error", description: "Failed to fetch content", variant: "destructive" });
    } finally {
      setContentLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API}/content/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchContactMessages();
    } else if (activeTab === 'content') {
      fetchContent();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  // Save personal info
  const savePersonalInfo = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/personal-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(personalInfo)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Personal info updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    }
  };

  // Save skill
  const saveSkill = async (skill, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API}/content/skills` : `${API}/content/skills/${encodeURIComponent(skill.category)}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skill)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: isNew ? "Skill added" : "Skill updated" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save skill", variant: "destructive" });
    }
  };

  // Delete skill
  const deleteSkill = async (category) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/skills/${encodeURIComponent(category)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Skill deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Save project
  const saveProject = async (project, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API}/content/projects` : `${API}/content/projects/${project.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: isNew ? "Project added" : "Project updated" });
        fetchContent();
        setEditModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Project deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Save certification
  const saveCertification = async (cert, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cert)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Certification added" });
        fetchContent();
        setEditModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save certification", variant: "destructive" });
    }
  };

  // Delete certification
  const deleteCertification = async (certName) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/certifications/${encodeURIComponent(certName)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Certification deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Save experience
  const saveExperience = async (exp, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API}/content/experience` : `${API}/content/experience/${exp.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(exp)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: isNew ? "Experience added" : "Experience updated" });
        fetchContent();
        setEditModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save experience", variant: "destructive" });
    }
  };

  // Delete experience
  const deleteExperience = async (expId) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/experience/${expId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Experience deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Save education
  const saveEducation = async (edu, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API}/content/education` : `${API}/content/education/${edu.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(edu)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: isNew ? "Education added" : "Education updated" });
        fetchContent();
        setEditModal({ open: false, type: '', data: null });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save education", variant: "destructive" });
    }
  };

  // Delete education
  const deleteEducation = async (eduId) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/education/${eduId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Education deleted" });
        fetchContent();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/content/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: "Settings saved" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
  };

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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    toast({ title: "Logged out successfully" });
    navigate('/admin-login');
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ 
        title: "Error", 
        description: "New passwords don't match", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({ title: "Success", description: "Password changed successfully" });
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast({ 
          title: "Error", 
          description: data.message || "Failed to change password", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to change password", 
        variant: "destructive" 
      });
    }
  };

  const COLORS = ['#00d4ff', '#10b981', '#f59e0b'];

  // Edit Modal Component
  const EditModal = () => {
    const [formData, setFormData] = useState(editModal.data || {});
    
    if (!editModal.open) return null;

    const handleChange = (field, value) => {
      setFormData({ ...formData, [field]: value });
    };

    const handleArrayChange = (field, value) => {
      const arr = value.split('\n').filter(v => v.trim());
      setFormData({ ...formData, [field]: arr });
    };

    const handleSubmit = () => {
      const isNew = !formData.id;
      switch (editModal.type) {
        case 'project':
          saveProject(formData, isNew);
          break;
        case 'certification':
          saveCertification(formData, true);
          break;
        case 'experience':
          saveExperience(formData, isNew);
          break;
        case 'education':
          saveEducation(formData, isNew);
          break;
        case 'skill':
          saveSkill(formData, isNew);
          break;
        default:
          break;
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditModal({ open: false, type: '', data: null })}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1a1f3a] border border-[#2a3150] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#e5e7eb] capitalize">
              {formData.id ? 'Edit' : 'Add'} {editModal.type}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditModal({ open: false, type: '', data: null })}>
              <X size={20} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {editModal.type === 'project' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Title</label>
                  <Input value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Description</label>
                  <textarea value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Category</label>
                    <Input value={formData.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Status</label>
                    <Input value={formData.status || ''} onChange={(e) => handleChange('status', e.target.value)} placeholder="Active / Completed" className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Duration</label>
                  <Input value={formData.duration || ''} onChange={(e) => handleChange('duration', e.target.value)} placeholder="e.g., Dec 2023 - May 2024" className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Technologies (one per line)</label>
                  <textarea value={(formData.technologies || []).join('\n')} onChange={(e) => handleArrayChange('technologies', e.target.value)} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Highlights (one per line)</label>
                  <textarea value={(formData.highlights || []).join('\n')} onChange={(e) => handleArrayChange('highlights', e.target.value)} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[80px]" />
                </div>
              </>
            )}

            {editModal.type === 'skill' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Category</label>
                  <Input value={formData.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Level (0-100)</label>
                  <Input type="number" min="0" max="100" value={formData.level || 50} onChange={(e) => handleChange('level', parseInt(e.target.value))} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
              </>
            )}

            {editModal.type === 'certification' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Name</label>
                  <Input value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Issuer</label>
                  <Input value={formData.issuer || ''} onChange={(e) => handleChange('issuer', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Year</label>
                    <Input type="number" value={formData.year || new Date().getFullYear()} onChange={(e) => handleChange('year', parseInt(e.target.value))} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Color</label>
                    <Input type="color" value={formData.color || '#00d4ff'} onChange={(e) => handleChange('color', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] h-10" />
                  </div>
                </div>
              </>
            )}

            {editModal.type === 'experience' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Title</label>
                  <Input value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Company</label>
                  <Input value={formData.company || ''} onChange={(e) => handleChange('company', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Duration</label>
                    <Input value={formData.duration || ''} onChange={(e) => handleChange('duration', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Location</label>
                    <Input value={formData.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Description</label>
                  <textarea value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Achievements (one per line)</label>
                  <textarea value={(formData.achievements || []).join('\n')} onChange={(e) => handleArrayChange('achievements', e.target.value)} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[80px]" />
                </div>
              </>
            )}

            {editModal.type === 'education' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Degree</label>
                  <Input value={formData.degree || ''} onChange={(e) => handleChange('degree', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">Institution</label>
                  <Input value={formData.institution || ''} onChange={(e) => handleChange('institution', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Location</label>
                    <Input value={formData.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                  <div className="flex items-center gap-2 pt-7">
                    <input type="checkbox" checked={formData.current || false} onChange={(e) => handleChange('current', e.target.checked)} className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]" />
                    <span className="text-[#e5e7eb]">Currently Enrolled</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Expected Completion</label>
                    <Input value={formData.expected || ''} onChange={(e) => handleChange('expected', e.target.value)} placeholder="e.g., July 2026" className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">Completed</label>
                    <Input value={formData.completed || ''} onChange={(e) => handleChange('completed', e.target.value)} placeholder="e.g., May 2024" className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 pt-6">
            <Button onClick={handleSubmit} className="flex-1 bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
              <Save size={16} className="mr-2" />
              Save
            </Button>
            <Button onClick={() => setEditModal({ open: false, type: '', data: null })} variant="ghost" className="flex-1 border border-[#2a3150] hover:bg-[#2a3150]">
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2 flex items-center gap-3">
                <SettingsIcon className="text-[#00d4ff]" size={36} />
                Admin Control Panel
              </h1>
              <p className="text-[#9ca3af]">Manage your portfolio content and analytics</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={() => setShowPasswordDialog(true)}
                variant="ghost"
                className="text-[#9ca3af] hover:text-[#00d4ff] border border-[#2a3150] hover:border-[#00d4ff]"
                data-testid="change-password-btn"
              >
                <Key size={20} className="mr-2" />
                Change Password
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-[#9ca3af] hover:text-[#00d4ff]"
                data-testid="back-to-site-btn"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Site
              </Button>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-[#ef4444] hover:text-[#dc2626] hover:bg-[#ef4444]/10"
                data-testid="logout-btn"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a1f3a]/50 border border-[#2a3150] mb-8 p-1">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
              data-testid="analytics-tab"
            >
              <BarChart3 size={16} className="mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
              data-testid="messages-tab"
            >
              <Mail size={16} className="mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
              data-testid="content-tab"
            >
              <Edit size={16} className="mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff] rounded-md transition-all"
              data-testid="settings-tab"
            >
              <SettingsIcon size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" data-testid="analytics-content">
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

          {/* Messages Tab */}
          <TabsContent value="messages" data-testid="messages-content">
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

          {/* Content Tab */}
          <TabsContent value="content" data-testid="content-content">
            {contentLoading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-[#00d4ff]" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Personal Info Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-[#00d4ff]" size={24} />
                    <h2 className="text-2xl font-bold text-[#e5e7eb]">Personal Information</h2>
                  </div>
                  
                  {personalInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Name</label>
                        <Input value={personalInfo.name || ''} onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Title</label>
                        <Input value={personalInfo.title || ''} onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Subtitle</label>
                        <Input value={personalInfo.subtitle || ''} onChange={(e) => setPersonalInfo({...personalInfo, subtitle: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Email</label>
                        <Input value={personalInfo.email || ''} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Phone</label>
                        <Input value={personalInfo.phone || ''} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Location</label>
                        <Input value={personalInfo.location || ''} onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">GitHub</label>
                        <Input value={personalInfo.github || ''} onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">LinkedIn</label>
                        <Input value={personalInfo.linkedin || ''} onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#9ca3af] mb-2">Bio</label>
                        <textarea value={personalInfo.bio || ''} onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})} className="w-full bg-[#0a0e27] border border-[#2a3150] rounded-md p-3 text-[#e5e7eb] min-h-[100px]" />
                      </div>
                      <div className="md:col-span-2">
                        <Button onClick={savePersonalInfo} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                          <Save size={16} className="mr-2" />
                          Save Personal Info
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Skills Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Code className="text-[#10b981]" size={24} />
                      <h2 className="text-2xl font-bold text-[#e5e7eb]">Skills</h2>
                    </div>
                    <Button onClick={() => setEditModal({ open: true, type: 'skill', data: { category: '', level: 50 } })} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                      <Plus size={16} className="mr-2" />
                      Add Skill
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-[#0a0e27]/50 rounded-lg p-4 border border-[#2a3150]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#e5e7eb] font-semibold">{skill.category}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-[#00d4ff] hover:bg-[#00d4ff]/10" onClick={() => setEditModal({ open: true, type: 'skill', data: skill })}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10" onClick={() => deleteSkill(skill.category)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#2a3150] rounded-full h-2">
                            <div className="bg-[#00d4ff] h-2 rounded-full transition-all" style={{ width: `${skill.level}%` }} />
                          </div>
                          <span className="text-xs text-[#9ca3af]">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Projects Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-[#f59e0b]" size={24} />
                      <h2 className="text-2xl font-bold text-[#e5e7eb]">Projects</h2>
                    </div>
                    <Button onClick={() => setEditModal({ open: true, type: 'project', data: { title: '', description: '', category: '', duration: '', technologies: [], status: 'Active', highlights: [], metrics: {} } })} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                      <Plus size={16} className="mr-2" />
                      Add Project
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-[#0a0e27]/50 rounded-lg p-4 border border-[#2a3150]">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#e5e7eb] mb-1">{project.title}</h3>
                            <p className="text-sm text-[#9ca3af] mb-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-2">
                              <span className="text-[#00d4ff]">{project.category}</span>
                              <span>•</span>
                              <span>{project.duration}</span>
                              <span>•</span>
                              <span className={project.status === 'Active' ? 'text-[#10b981]' : 'text-[#9ca3af]'}>{project.status}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {project.technologies?.map((tech, i) => (
                                <span key={i} className="text-xs bg-[#00d4ff]/10 text-[#00d4ff] px-2 py-1 rounded">{tech}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-[#00d4ff] hover:bg-[#00d4ff]/10" onClick={() => setEditModal({ open: true, type: 'project', data: project })}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10" onClick={() => deleteProject(project.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Certifications Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Award className="text-[#8b5cf6]" size={24} />
                      <h2 className="text-2xl font-bold text-[#e5e7eb]">Certifications</h2>
                    </div>
                    <Button onClick={() => setEditModal({ open: true, type: 'certification', data: { name: '', issuer: '', year: new Date().getFullYear(), verified: true, color: '#00d4ff' } })} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                      <Plus size={16} className="mr-2" />
                      Add Certification
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="bg-[#0a0e27]/50 rounded-lg p-4 border border-[#2a3150]" style={{ borderLeftColor: cert.color, borderLeftWidth: '3px' }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-[#e5e7eb] font-semibold mb-1">{cert.name}</h3>
                            <p className="text-xs text-[#9ca3af]">{cert.issuer} • {cert.year}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10" onClick={() => deleteCertification(cert.name)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Experience Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-[#06b6d4]" size={24} />
                      <h2 className="text-2xl font-bold text-[#e5e7eb]">Experience</h2>
                    </div>
                    <Button onClick={() => setEditModal({ open: true, type: 'experience', data: { title: '', company: '', duration: '', location: '', description: '', achievements: [] } })} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                      <Plus size={16} className="mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="bg-[#0a0e27]/50 rounded-lg p-4 border border-[#2a3150]">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#e5e7eb] mb-1">{exp.title}</h3>
                            <p className="text-sm text-[#00d4ff] mb-1">{exp.company}</p>
                            <p className="text-xs text-[#6b7280] mb-2">{exp.duration} {exp.location && `• ${exp.location}`}</p>
                            <p className="text-sm text-[#9ca3af] mb-2">{exp.description}</p>
                            {exp.achievements?.length > 0 && (
                              <ul className="list-disc list-inside text-xs text-[#6b7280]">
                                {exp.achievements.map((ach, i) => (
                                  <li key={i}>{ach}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-[#00d4ff] hover:bg-[#00d4ff]/10" onClick={() => setEditModal({ open: true, type: 'experience', data: exp })}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10" onClick={() => deleteExperience(exp.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Education Section */}
                <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="text-[#ec4899]" size={24} />
                      <h2 className="text-2xl font-bold text-[#e5e7eb]">Education</h2>
                    </div>
                    <Button onClick={() => setEditModal({ open: true, type: 'education', data: { degree: '', institution: '', location: '', expected: '', completed: '', current: false } })} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                      <Plus size={16} className="mr-2" />
                      Add Education
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="bg-[#0a0e27]/50 rounded-lg p-4 border border-[#2a3150]">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#e5e7eb] mb-1">{edu.degree}</h3>
                            <p className="text-sm text-[#00d4ff] mb-1">{edu.institution}</p>
                            <p className="text-xs text-[#6b7280]">
                              {edu.location && `${edu.location} • `}
                              {edu.current ? `Expected: ${edu.expected}` : `Completed: ${edu.completed}`}
                              {edu.current && <span className="ml-2 text-[#10b981]">(Current)</span>}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-[#00d4ff] hover:bg-[#00d4ff]/10" onClick={() => setEditModal({ open: true, type: 'education', data: edu })}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10" onClick={() => deleteEducation(edu.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" data-testid="settings-content">
            <Card className="bg-[#1a1f3a]/50 border-[#2a3150] p-6">
              <h2 className="text-2xl font-bold text-[#e5e7eb] mb-6">Website Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#9ca3af] mb-2 block">
                    Theme Color
                  </label>
                  <Input 
                    type="color" 
                    value={settings.theme_color || '#00d4ff'}
                    onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                    className="w-32 h-12 bg-[#0a0e27] border-[#2a3150]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.enable_analytics !== false}
                      onChange={(e) => setSettings({...settings, enable_analytics: e.target.checked})}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Analytics Tracking</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.enable_contact_form !== false}
                      onChange={(e) => setSettings({...settings, enable_contact_form: e.target.checked})}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Contact Form</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.enable_threat_map !== false}
                      onChange={(e) => setSettings({...settings, enable_threat_map: e.target.checked})}
                      className="w-5 h-5 rounded border-[#2a3150] bg-[#0a0e27]"
                    />
                    <span className="text-[#e5e7eb]">Enable Threat Map</span>
                  </label>
                </div>

                <Button onClick={saveSettings} className="bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]">
                  <Save size={16} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordDialog(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1f3a] border border-[#2a3150] rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-[#e5e7eb] mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                    className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                    minLength={6}
                    className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                    minLength={6}
                    className="bg-[#0a0e27] border-[#2a3150] text-[#e5e7eb]"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27]"
                  >
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowPasswordDialog(false)}
                    variant="ghost"
                    className="flex-1 border border-[#2a3150] hover:bg-[#2a3150]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        <EditModal />
      </div>
    </div>
  );
};

export default AdminPanel;
