import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const hrToken = localStorage.getItem('hrToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (hrToken) {
    config.headers.Authorization = `Bearer ${hrToken}`;
  }
  return config;
});

// Auth APIs
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// HR APIs
export const registerCompany = async (companyData) => {
  const response = await api.post('/hr/register', companyData);
  return response.data;
};

export const loginCompany = async (credentials) => {
  const response = await api.post('/hr/login', credentials);
  return response.data;
};

export const getCurrentCompany = async () => {
  const response = await api.get('/hr/me');
  return response.data;
};

export const getCompanyApplications = async (statusFilter = null) => {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const response = await api.get('/hr/applications', { params });
  return response.data;
};

export const updateApplicationStatus = async (applicationId, newStatus) => {
  const response = await api.patch(`/hr/applications/${applicationId}/status`, null, {
    params: { new_status: newStatus }
  });
  return response.data;
};

// Resume APIs
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyResumes = async () => {
  const response = await api.get('/resume/my-resumes');
  return response.data;
};

// Job APIs
// export const getJobRecommendations = async (resumeId, topN = 10) => {
//   const token = localStorage.getItem("access_token");

//   return axios.get(
//     `http://localhost:8001/jobs/recommendations`,
//     {
//       params: {
//         resume_id: resumeId,
//         top_n: topN
//       },
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   ).then(res => res.data);
// };

export const getJobRecommendations = async (resumeId, topN = 10) => {
  const response = await api.get('/jobs/recommendations', {
    params: {
      resume_id: resumeId,
      top_n: topN
    }
  });

  return response.data;
};




// Application APIs
export const applyToJob = async (applicationData) => {
  const response = await api.post('/applications/apply', applicationData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/applications/my-applications');
  return response.data;
};

export const checkApplicationStatus = async (jobId) => {
  const response = await api.get(`/applications/check/${jobId}`);
  return response.data;
};


// Resume viewing for HR
export const viewResumeDetails = async (resumeId) => {
  const response = await api.get(`/applications/view-resume/${resumeId}`);
  return response.data;
};

export const downloadResume = async (resumeId, filename) => {
  const response = await api.get(`/applications/download-resume/${resumeId}`, {
    responseType: 'blob'
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return response.data;
};


export default api;