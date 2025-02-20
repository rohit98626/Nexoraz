import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGraphs = createAsyncThunk(
  'graph/fetchGraphs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/graphs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGraph = createAsyncThunk(
  'graph/createGraph',
  async (graphData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/graphs', graphData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const graphSlice = createSlice({
  name: 'graph',
  initialState: {
    graphs: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGraphs.fulfilled, (state, action) => {
        state.loading = false;
        state.graphs = action.payload;
      })
      .addCase(fetchGraphs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createGraph.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.graphs.push(action.payload);
      })
      .addCase(createGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  }
});

export default graphSlice.reducer; 