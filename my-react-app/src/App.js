// import React from 'react';
// import ExampleComponent from './components/ExampleComponent';

// function App() {
//     return (
//         <div className="App">
//             <h1>Welcome to My React App</h1>
//             <ExampleComponent />
//         </div>
//     );
// }

// export default App;
import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, Ticket, Mail, FileText, MessageSquare, BarChart3, Users, Settings, LogOut, Plus, Search, Filter, Clock, AlertCircle, CheckCircle, XCircle, Edit, Trash2, Send, ChevronDown, Menu, X } from 'lucide-react';
import './styles/App.css';

// Mock Data
const mockUsers = [
  { id: 1, email: 'john.doe@company.com', name: 'John Doe', role: 'user', avatar: null },
  { id: 2, email: 'agent1@company.com', name: 'Sarah Agent', role: 'agent', avatar: null },
  { id: 3, email: 'admin@company.com', name: 'Admin User', role: 'admin', avatar: null },
];

const mockTickets = [
  { id: 1, title: 'Cannot access email', description: 'I am unable to log into my email account', status: 'open', priority: 'high', userId: 1, assignedTo: 2, department: 'IT Support', category: 'Email', createdAt: '2025-10-15T10:30:00', slaDeadline: '2025-10-17T18:30:00' },
  { id: 2, title: 'Software installation request', description: 'Need Adobe Creative Cloud installed', status: 'in_progress', priority: 'medium', userId: 1, assignedTo: 2, department: 'IT Support', category: 'Software', createdAt: '2025-10-16T14:20:00', slaDeadline: '2025-10-18T14:20:00' },
  { id: 3, title: 'Password reset needed', description: 'Forgot my system password', status: 'resolved', priority: 'urgent', userId: 1, assignedTo: 2, department: 'IT Support', category: 'Account', createdAt: '2025-10-14T09:15:00', slaDeadline: '2025-10-14T17:15:00' },
];

const mockKBArticles = [
  { id: 1, title: 'How to Reset Your Password', content: 'Follow these steps to reset your password: 1. Go to login page 2. Click "Forgot Password" 3. Enter your email 4. Check your inbox for reset link', category: 'Account', tags: ['password', 'account', 'security'], views: 152, createdBy: 2, createdAt: '2025-10-01' },
  { id: 2, title: 'Email Configuration Guide', content: 'Configure your email client with these settings: Server: mail.company.com, Port: 993 (IMAP), Security: SSL/TLS', category: 'Email', tags: ['email', 'setup', 'configuration'], views: 89, createdBy: 2, createdAt: '2025-10-05' },
];

const mockCannedResponses = [
  { id: 1, title: 'Ticket Received', content: 'Thank you for contacting support. We have received your ticket and will respond shortly.', category: 'General' },
  { id: 2, title: 'Need More Info', content: 'Could you please provide more details about the issue? Screenshots would be helpful.', category: 'Follow-up' },
  { id: 3, title: 'Issue Resolved', content: 'We are glad to inform you that your issue has been resolved. Please let us know if you need further assistance.', category: 'Resolution' },
];

// Context
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Components
const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#710117] text-white hover:bg-[#8d0119]',
    secondary: 'bg-[#54627B] text-white hover:bg-[#3d4a5e]',
    outline: 'border-2 border-[#710117] text-[#710117] hover:bg-[#710117] hover:text-white',
    ghost: 'text-[#54627B] hover:bg-[#ECD5BB]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
    {children}
  </div>
);

const Input = ({ label, type = 'text', value, onChange, placeholder, required, className = '' }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-[#54627B] mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710117] focus:border-transparent outline-none transition-all"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4, required, className = '' }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-[#54627B] mb-1">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710117] focus:border-transparent outline-none transition-all resize-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required, className = '' }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-[#54627B] mb-1">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710117] focus:border-transparent outline-none transition-all bg-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Avatar = ({ name, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  
  return (
    <div 
      className={`${sizes[size]} rounded-full text-white flex items-center justify-center font-semibold`}
      style={{ backgroundColor: '#710117' }}
    >
      {initials}
    </div>
  );
};

const SLAIndicator = ({ deadline }) => {
  const now = new Date();
  const slaDate = new Date(deadline);
  const diff = slaDate - now;
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';
  if (hoursLeft < 4) {
    color = 'text-red-600';
    bgColor = 'bg-red-100';
  } else if (hoursLeft < 24) {
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-100';
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${color} text-xs font-medium`}>
      <Clock size={12} />
      <span>{hoursLeft > 0 ? `${hoursLeft}h left` : 'Overdue'}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: XCircle },
    pending: { label: 'Pending', color: 'bg-purple-100 text-purple-700', icon: Clock },
  };
  
  const config = statusConfig[status] || statusConfig.open;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-700' },
    medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
    urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
  };
  
  const config = priorityConfig[priority] || priorityConfig.medium;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('serviceDesk_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email) => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      console.log('Login successful:', foundUser);
      setUser(foundUser);
      localStorage.setItem('serviceDesk_user', JSON.stringify(foundUser));
      return true;
    }
    console.log('Login failed: user not found');
    return false;
  };

  const signup = (email, name) => {
    const newUser = { id: Date.now(), email, name, role: 'user', avatar: null };
    console.log('Signup successful:', newUser);
    setUser(newUser);
    localStorage.setItem('serviceDesk_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    console.log('Logout');
    setUser(null);
    localStorage.removeItem('serviceDesk_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Layout Component
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = {
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'tickets', label: 'My Tickets', icon: Ticket },
      { id: 'knowledge', label: 'Knowledge Base', icon: FileText },
    ],
    agent: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'tickets', label: 'Ticket Queue', icon: Ticket },
      { id: 'knowledge', label: 'Knowledge Base', icon: FileText },
      { id: 'canned', label: 'Canned Responses', icon: MessageSquare },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'tickets', label: 'All Tickets', icon: Ticket },
      { id: 'knowledge', label: 'Knowledge Base', icon: FileText },
      { id: 'agents', label: 'Agent Management', icon: Users },
      { id: 'canned', label: 'Canned Responses', icon: MessageSquare },
    ],
  };

  const navItems = navigation[user.role] || navigation.user;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ECD5BB' }}>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden" style={{ color: '#54627B' }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-bold" style={{ color: '#710117' }}>Service Desk</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <div className="text-sm">
                  <div className="font-medium" style={{ color: '#54627B' }}>{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30 lg:z-0`}>
          <nav className="p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-[#710117] text-white'
                      : 'text-[#54627B] hover:bg-[#ECD5BB]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'tickets' && <TicketList />}
          {currentPage === 'knowledge' && <KnowledgeBase />}
          {currentPage === 'canned' && <CannedResponses />}
          {currentPage === 'agents' && <AgentManagement />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [tickets] = useState(mockTickets);
  
  const userTickets = user.role === 'user' 
    ? tickets.filter(t => t.userId === user.id)
    : user.role === 'agent'
    ? tickets.filter(t => t.assignedTo === user.id)
    : tickets;

  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'open').length,
    inProgress: userTickets.filter(t => t.status === 'in_progress').length,
    resolved: userTickets.filter(t => t.status === 'resolved').length,
  };

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <Card hover className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold" style={{ color: '#54627B' }}>{value}</p>
      </div>
      <div className="p-4 rounded-full" style={{ backgroundColor: color }}>
        <Icon size={28} className="text-white" />
      </div>
    </Card>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#710117' }}>Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tickets" value={stats.total} color="#710117" icon={Ticket} />
        <StatCard title="Open" value={stats.open} color="#3b82f6" icon={AlertCircle} />
        <StatCard title="In Progress" value={stats.inProgress} color="#eab308" icon={Clock} />
        <StatCard title="Resolved" value={stats.resolved} color="#22c55e" icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#54627B' }}>Recent Tickets</h3>
          <div className="space-y-3">
            {userTickets.slice(0, 5).map(ticket => (
              <div key={ticket.id} className="flex items-start justify-between p-3 rounded-lg" style={{ backgroundColor: '#ECD5BB' }}>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#54627B' }}>{ticket.title}</p>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <SLAIndicator deadline={ticket.slaDeadline} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#54627B' }}>Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-start">
              <Plus size={20} />
              Create New Ticket
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <FileText size={20} />
              Browse Knowledge Base
            </Button>
            {(user.role === 'agent' || user.role === 'admin') && (
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare size={20} />
                View Canned Responses
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Ticket List Component
const TicketList = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(mockTickets);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesRole = user.role === 'user' 
      ? ticket.userId === user.id
      : user.role === 'agent'
      ? ticket.assignedTo === user.id
      : true;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesPriority && matchesSearch;
  });

  const CreateTicketModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium',
      department: 'IT Support',
      category: 'General',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newTicket = {
        id: Date.now(),
        ...formData,
        status: 'open',
        userId: user.id,
        assignedTo: null,
        createdAt: new Date().toISOString(),
        slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      };
      setTickets([newTicket, ...tickets]);
      setShowCreateModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#710117]">Create New Ticket</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of the issue"
              required
            />
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed explanation of the issue"
              required
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              options={[
                { value: 'IT Support', label: 'IT Support' },
                { value: 'HR', label: 'HR' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Facilities', label: 'Facilities' },
              ]}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={[
                { value: 'General', label: 'General' },
                { value: 'Email', label: 'Email' },
                { value: 'Software', label: 'Software' },
                { value: 'Hardware', label: 'Hardware' },
                { value: 'Account', label: 'Account' },
              ]}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                <Plus size={20} />
                Create Ticket
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#710117]">
          {user.role === 'user' ? 'My Tickets' : user.role === 'agent' ? 'Ticket Queue' : 'All Tickets'}
        </h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710117] focus:border-transparent outline-none"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
          <Button variant="ghost" onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setSearchQuery(''); }}>
            <Filter size={20} />
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTickets.map(ticket => (
          <Card key={ticket.id} hover>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-[#54627B] flex-1">{ticket.title}</h3>
              <SLAIndicator deadline={ticket.slaDeadline} />
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{ticket.department}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{ticket.category}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Created {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="text-center py-12">
          <Ticket size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No tickets found</p>
        </Card>
      )}

      {showCreateModal && <CreateTicketModal />}
    </div>
  );
};

// Knowledge Base Component
const KnowledgeBase = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState(mockKBArticles);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const CreateArticleModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: 'General',
      tags: '',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newArticle = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()),
        views: 0,
        createdBy: user.id,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setArticles([newArticle, ...articles]);
      setShowCreateModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#710117]">Create Knowledge Base Article</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Article title"
              required
            />
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Article content"
              rows={8}
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={[
                { value: 'General', label: 'General' },
                { value: 'Account', label: 'Account' },
                { value: 'Email', label: 'Email' },
                { value: 'Software', label: 'Software' },
                { value: 'Hardware', label: 'Hardware' },
              ]}
            />
            <Input
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="password, security, account"
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                <Plus size={20} />
                Create Article
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#710117]">Knowledge Base</h2>
        {(user.role === 'agent' || user.role === 'admin') && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            New Article
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#710117] focus:border-transparent outline-none"
          />
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredArticles.map(article => (
          <Card key={article.id} hover>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-[#54627B] flex-1">{article.title}</h3>
              <span className="text-xs px-2 py-1 bg-[#710117] text-white rounded-full">{article.category}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-[#ECD5BB] text-[#54627B] rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">{article.views} views</span>
              <Button variant="ghost" size="sm">
                Read More
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No articles found</p>
        </Card>
      )}

      {showCreateModal && <CreateArticleModal />}
    </div>
  );
};

// Canned Responses Component
const CannedResponses = () => {
  const [responses, setResponses] = useState(mockCannedResponses);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const CreateResponseModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: 'General',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newResponse = {
        id: Date.now(),
        ...formData,
      };
      setResponses([newResponse, ...responses]);
      setShowCreateModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#710117]">Create Canned Response</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Response title"
              required
            />
            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Response content"
              rows={6}
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={[
                { value: 'General', label: 'General' },
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'Resolution', label: 'Resolution' },
                { value: 'Escalation', label: 'Escalation' },
              ]}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                <Plus size={20} />
                Create Response
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#710117]">Canned Responses</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          New Response
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {responses.map(response => (
          <Card key={response.id} hover>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-[#54627B] flex-1">{response.title}</h3>
              <span className="text-xs px-2 py-1 bg-[#710117] text-white rounded-full">{response.category}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{response.content}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Send size={16} />
                Use Response
              </Button>
              <Button variant="ghost" size="sm">
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showCreateModal && <CreateResponseModal />}
    </div>
  );
};

// Agent Management Component
const AgentManagement = () => {
  const [agents] = useState(mockUsers.filter(u => u.role === 'agent' || u.role === 'admin'));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#710117]">Agent Management</h2>
        <Button variant="primary">
          <Plus size={20} />
          Add Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map(agent => (
          <Card key={agent.id} hover>
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={agent.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#54627B]">{agent.name}</h3>
                <p className="text-sm text-gray-600">{agent.email}</p>
                <span className="inline-block mt-1 text-xs px-2 py-1 bg-[#710117] text-white rounded-full capitalize">
                  {agent.role}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#710117]">
                  {mockTickets.filter(t => t.assignedTo === agent.id).length}
                </p>
                <p className="text-xs text-gray-600">Active Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#710117]">
                  {mockTickets.filter(t => t.assignedTo === agent.id && t.status === 'resolved').length}
                </p>
                <p className="text-xs text-gray-600">Resolved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#710117]">95%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="sm" className="flex-1">
                <Edit size={16} />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Settings size={16} />
                Settings
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Login Component
const Login = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    console.log('Attempting login with:', email);
    const success = login(email);
    if (!success) {
      setError('Account not found. Please check your email or sign up.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ECD5BB' }}>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#710117' }}>Service Desk</h1>
          <p style={{ color: '#54627B' }}>Sign in to your account</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#54627B' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="your.email@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#54627B' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Any password (demo)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all duration-200"
            style={{ backgroundColor: '#710117' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#8d0119'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#710117'}
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#54627B' }}>
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="font-medium hover:underline" style={{ color: '#710117' }}>
              Sign up
            </button>
          </p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-2">Demo Accounts:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>User:</strong> john.doe@company.com</p>
            <p><strong>Agent:</strong> agent1@company.com</p>
            <p><strong>Admin:</strong> admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const Signup = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Attempting signup with:', formData);
    signup(formData.email, formData.name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ECD5BB' }}>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#710117' }}>Service Desk</h1>
          <p style={{ color: '#54627B' }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#54627B' }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#54627B' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your.email@company.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#54627B' }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Any password (demo)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium rounded-lg transition-all duration-200"
            style={{ backgroundColor: '#710117' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#8d0119'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#710117'}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#54627B' }}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-medium hover:underline" style={{ color: '#710117' }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user, loading }) => {
          if (loading) {
            return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECD5BB' }}>
                <div className="text-xl" style={{ color: '#710117' }}>Loading...</div>
              </div>
            );
          }

          if (!user) {
            return showSignup ? (
              <Signup onSwitchToLogin={() => setShowSignup(false)} />
            ) : (
              <Login onSwitchToSignup={() => setShowSignup(true)} />
            );
          }

          return <Layout />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;