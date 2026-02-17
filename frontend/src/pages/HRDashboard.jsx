// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Building2, LogOut, Users, FileText, Clock, 
//   CheckCircle, XCircle, Eye, Download, Filter,
//   TrendingUp, Star, Zap
// } from 'lucide-react';
// import { 
//   getCurrentCompany, 
//   getCompanyApplications, 
//   updateApplicationStatus 
// } from '../services/api';

// const HRDashboard = () => {
//   const navigate = useNavigate();
//   const [company, setCompany] = useState(null);
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     shortlisted: 0,
//     rejected: 0
//   });

//   useEffect(() => {
//     loadDashboardData();
//   }, [statusFilter]);

//   const loadDashboardData = async () => {
//     setLoading(true);
//     try {
//       const companyData = await getCurrentCompany();
//       setCompany(companyData);
      
//       const applicationsData = await getCompanyApplications(statusFilter);
//       setApplications(applicationsData);
      
//       // Calculate stats
//       const stats = {
//         total: applicationsData.length,
//         pending: applicationsData.filter(a => a.status === 'pending').length,
//         shortlisted: applicationsData.filter(a => a.status === 'shortlisted').length,
//         rejected: applicationsData.filter(a => a.status === 'rejected').length
//       };
//       setStats(stats);
      
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       if (error.response?.status === 401) {
//         navigate('/hr/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('hrToken');
//     navigate('/hr/login');
//   };

//   const handleStatusChange = async (applicationId, newStatus) => {
//     try {
//       await updateApplicationStatus(applicationId, newStatus);
//       loadDashboardData(); // Reload data
//     } catch (error) {
//       alert('Failed to update status');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const config = {
//       pending: { color: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50', icon: Clock },
//       reviewed: { color: 'bg-blue-900/30 text-blue-300 border-blue-800/50', icon: Eye },
//       shortlisted: { color: 'bg-green-900/30 text-green-300 border-green-800/50', icon: CheckCircle },
//       rejected: { color: 'bg-red-900/30 text-red-300 border-red-800/50', icon: XCircle }
//     };
    
//     const { color, icon: Icon } = config[status] || config.pending;
    
//     return (
//       <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${color} flex items-center gap-1`}>
//         <Icon className="h-4 w-4" />
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
//       {/* Navbar */}
//       <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <Building2 className="h-8 w-8 text-red-400" />
//               <div>
//                 <span className="text-xl font-bold text-white">
//                   {company?.name}
//                 </span>
//                 <p className="text-xs text-gray-400">HR Portal</p>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
//             >
//               <LogOut className="h-5 w-5" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Welcome back, <span className="neon-text">{company?.name}</span>
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Manage applications and find the best talent
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           {[
//             { label: 'Total Applications', value: stats.total, icon: Users, color: 'from-purple-500 to-pink-500' },
//             { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
//             { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'from-green-500 to-emerald-500' },
//             { label: 'Processed', value: stats.rejected, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' }
//           ].map((stat, index) => (
//             <div key={index} className="card glow-effect group">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}/20`}>
//                   <stat.icon className={`h-6 w-6 text-white`} />
//                 </div>
//                 <div className="text-right">
//                   <p className="text-3xl font-bold text-white">{stat.value}</p>
//                 </div>
//               </div>
//               <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Filter Buttons */}
//         <div className="mb-6 flex flex-wrap gap-3">
//           <button
//             onClick={() => setStatusFilter(null)}
//             className={`px-4 py-2 rounded-xl font-semibold transition-all ${
//               statusFilter === null
//                 ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
//                 : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//             }`}
//           >
//             <Filter className="inline h-4 w-4 mr-2" />
//             All Applications
//           </button>
//           {['pending', 'shortlisted', 'reviewed', 'rejected'].map((status) => (
//             <button
//               key={status}
//               onClick={() => setStatusFilter(status)}
//               className={`px-4 py-2 rounded-xl font-semibold transition-all ${
//                 statusFilter === status
//                   ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
//                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Applications Table */}
//         <div className="card glow-effect">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-white flex items-center">
//               <FileText className="h-6 w-6 mr-2 text-red-400" />
//               Applications
//             </h2>
//             <span className="text-gray-400">
//               {applications.length} applications
//             </span>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="relative">
//                 <div className="h-16 w-16 border-4 border-gray-800 rounded-full"></div>
//                 <div className="absolute top-0 left-0 h-16 w-16 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
//               </div>
//             </div>
//           ) : applications.length === 0 ? (
//             <div className="text-center py-16">
//               <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
//               <p className="text-gray-400 text-lg">No applications yet</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-800">
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Candidate</th>
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Position</th>
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Skills</th>
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Applied</th>
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
//                     <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {applications.map((application) => (
//                     <tr key={application.id} className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors">
//                       <td className="py-4 px-4">
//                         <div>
//                           <p className="text-white font-semibold">{application.user_name}</p>
//                           <p className="text-gray-400 text-sm">{application.user_email}</p>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 text-gray-300">{application.job_title}</td>
//                       <td className="py-4 px-4">
//                         <div className="flex flex-wrap gap-1">
//                           {application.skills.slice(0, 3).map((skill, i) => (
//                             <span key={i} className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">
//                               {skill}
//                             </span>
//                           ))}
//                           {application.skills.length > 3 && (
//                             <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
//                               +{application.skills.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 text-gray-400 text-sm">
//                         {new Date(application.applied_at).toLocaleDateString()}
//                       </td>
//                       <td className="py-4 px-4">{getStatusBadge(application.status)}</td>
//                       <td className="py-4 px-4">
//                         <div className="flex gap-2">
//                           {application.status === 'pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleStatusChange(application.id, 'shortlisted')}
//                                 className="p-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors"
//                                 title="Shortlist"
//                               >
//                                 <CheckCircle className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleStatusChange(application.id, 'rejected')}
//                                 className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
//                                 title="Reject"
//                               >
//                                 <XCircle className="h-4 w-4" />
//                               </button>
//                             </>
//                           )}
//                           <button
//                             className="p-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors"
//                             title="View Resume"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HRDashboard;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, LogOut, Users, FileText, Clock, 
  CheckCircle, XCircle, Eye, Download, Filter,
  TrendingUp, Star, Zap, Mail, Phone
} from 'lucide-react';
import { 
  getCurrentCompany, 
  getCompanyApplications, 
  updateApplicationStatus 
} from '../services/api';
import ResumeViewerModal from '../components/ResumeViewerModal';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [statusFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const companyData = await getCurrentCompany();
      setCompany(companyData);
      
      const applicationsData = await getCompanyApplications(statusFilter);
      setApplications(applicationsData);
      
      // Calculate stats
      const stats = {
        total: applicationsData.length,
        pending: applicationsData.filter(a => a.status === 'pending').length,
        shortlisted: applicationsData.filter(a => a.status === 'shortlisted').length,
        rejected: applicationsData.filter(a => a.status === 'rejected').length
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/hr/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrToken');
    navigate('/hr/login');
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      loadDashboardData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleViewResume = (resumeId, applicantName) => {
    setSelectedResume(resumeId);
    setSelectedApplicant(applicantName);
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50', icon: Clock },
      reviewed: { color: 'bg-blue-900/30 text-blue-300 border-blue-800/50', icon: Eye },
      shortlisted: { color: 'bg-green-900/30 text-green-300 border-green-800/50', icon: CheckCircle },
      rejected: { color: 'bg-red-900/30 text-red-300 border-red-800/50', icon: XCircle }
    };
    
    const { color, icon: Icon } = config[status] || config.pending;
    
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${color} flex items-center gap-1`}>
        <Icon className="h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMatchBadge = (score) => {
    if (!score) return null;
    
    const percentage = (score * 100).toFixed(0);
    let colorClass = 'from-gray-500 to-gray-600';
    
    if (score >= 0.7) colorClass = 'from-green-500 to-emerald-500';
    else if (score >= 0.5) colorClass = 'from-yellow-500 to-orange-500';
    else if (score >= 0.3) colorClass = 'from-orange-500 to-red-500';
    
    return (
      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${colorClass}/20 border border-current/30 text-sm font-semibold`}>
        {percentage}% Match
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-lg opacity-50"></div>
                <Building2 className="h-8 w-8 text-red-400 relative z-10" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  {company?.name}
                </span>
                <p className="text-xs text-gray-400">HR Portal</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="neon-text">{company?.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage applications and find the best talent
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: stats.total, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'from-green-500 to-emerald-500' },
            { label: 'Processed', value: stats.rejected, icon: TrendingUp, color: 'from-blue-500 to-cyan-500' }
          ].map((stat, index) => (
            <div key={index} className="card glow-effect group hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}/20`}>
                  <stat.icon className={`h-6 w-6 text-white`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              statusFilter === null
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Filter className="inline h-4 w-4 mr-2" />
            All Applications
          </button>
          {['pending', 'shortlisted', 'reviewed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div className="card glow-effect">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FileText className="h-6 w-6 mr-2 text-red-400" />
              Applications
            </h2>
            <span className="text-gray-400">
              {applications.length} applications
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute top-0 left-0 h-16 w-16 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No applications yet</p>
              <p className="text-gray-500 text-sm mt-2">Applications will appear here when candidates apply</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Candidate</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Position</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Match</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Skills</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Applied</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id} className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-semibold">{application.user_name}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {application.user_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-300 font-medium">{application.job_title}</p>
                      </td>
                      <td className="py-4 px-4">
                        {getMatchBadge(application.similarity_score)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {application.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {application.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                              +{application.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(application.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(application.id, 'shortlisted')}
                                className="p-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors"
                                title="Shortlist"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(application.id, 'rejected')}
                                className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewResume(application.resume_id, application.user_name)}
                            className="p-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors"
                            title="View Resume"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Resume Viewer Modal */}
      <ResumeViewerModal
        resumeId={selectedResume}
        applicantName={selectedApplicant}
        isOpen={!!selectedResume}
        onClose={() => {
          setSelectedResume(null);
          setSelectedApplicant(null);
        }}
      />
    </div>
  );
};

export default HRDashboard;