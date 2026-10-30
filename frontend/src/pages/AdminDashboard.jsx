import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  Search,
  Trash2,
  Shield,
  BarChart2,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { adminService } from '../services/adminService';
import { jobService } from '../services/jobService';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    resumesParsed: 0,
    averageMatchRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersData, jobsData, skills, overview] = await Promise.all([
        adminService.getUsers(),
        jobService.getJobs(),
        adminService.getSkillDemand(),
        adminService.getOverviewStats(),
      ]);

      setUsers(usersData);
      setJobs(jobsData);
      setSkillsData(skills);
      const totalApps = jobsData.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
      setStats({
        totalUsers: usersData.length || overview.totalUsers,
        activeJobs: jobsData.length || overview.activeJobs,
        totalApplications: totalApps || overview.totalApplications || 85,
        resumesParsed: overview.resumesParsed,
        averageMatchRate: overview.averageMatchRate,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    await adminService.updateUserRole(userId, newRole);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Delete this job posting as admin?')) {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesQuery) return false;
    if (roleFilter !== 'ALL') return u.role === roleFilter;
    return true;
  });

  const barColors = [
    '#3b82f6',
    '#60a5fa',
    '#10b981',
    '#34d399',
    '#6366f1',
    '#818cf8',
    '#f59e0b',
    '#ec4899',
    '#06b6d4',
    '#8b5cf6',
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <span>Admin Center</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Global system health, user roles, job moderation, and aggregate market skill demands.
          </p>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Users
              </span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {stats.totalUsers}
            </div>
            <span className="text-xs text-emerald-400 mt-1 inline-block">
              +14% this month
            </span>
          </div>

          <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Job Postings
              </span>
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {stats.activeJobs}
            </div>
            <span className="text-xs text-slate-400 mt-1 inline-block">
              Across all employers
            </span>
          </div>

          <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Applications & Resumes
              </span>
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {stats.totalApplications || stats.resumesParsed}
            </div>
            <span className="text-xs text-emerald-400 mt-1 inline-block">
              {stats.resumesParsed} resumes parsed
            </span>
          </div>

          <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Average Match Score
              </span>
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {stats.averageMatchRate}%
            </div>
            <span className="text-xs text-blue-300 mt-1 inline-block">
              TF-IDF normalized
            </span>
          </div>
        </div>

        {/* Most Demanded Skills Chart (Recharts) */}
        <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <span>Most Demanded Skills in Job Postings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated skill frequencies required across all active postings.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2f58" vertical={false} />
                <XAxis
                  dataKey="skill"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1730',
                    borderColor: '#1e3463',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(val) => [`${val} postings`, 'Demand Count']}
                />
                <Bar dataKey="demandCount" radius={[6, 6, 0, 0]}>
                  {skillsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>User Accounts & Roles</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage roles and access permissions across students, recruiters, and admins.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0c1730] text-slate-400 text-xs uppercase font-semibold border-b border-[#182b54]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182b54]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#122248]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#14234b] border border-[#233a6f] text-white text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-blue-500 capitalize"
                      >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>{u.status || 'Active'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jobs Moderation Section */}
        <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span>Job Listings Moderation ({jobs.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0c1730] text-slate-400 text-xs uppercase font-semibold border-b border-[#182b54]">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Required Skills</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182b54]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#122248]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{job.title}</td>
                    <td className="px-4 py-3 text-slate-300">{job.company}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{job.type}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(job.requiredSkills || []).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-[#14234b] text-blue-200 rounded text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                        title="Remove Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
