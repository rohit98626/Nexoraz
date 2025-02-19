import api from './api';

const graphService = {
  getGraphs: async () => {
    const response = await api.get('/graphs');
    return response;
  },

  getGraph: async (id) => {
    const response = await api.get(`/graphs/${id}`);
    return response;
  },

  createGraph: async (graphData) => {
    const response = await api.post('/graphs', graphData);
    return response;
  },

  updateGraph: async (id, graphData) => {
    const response = await api.put(`/graphs/${id}`, graphData);
    return response;
  },

  deleteGraph: async (id) => {
    const response = await api.delete(`/graphs/${id}`);
    return response;
  },

  addNode: async (graphId, nodeData) => {
    const response = await api.post(`/graphs/${graphId}/nodes`, nodeData);
    return response;
  },

  addEdge: async (graphId, edgeData) => {
    const response = await api.post(`/graphs/${graphId}/edges`, edgeData);
    return response;
  },
};

export default graphService;