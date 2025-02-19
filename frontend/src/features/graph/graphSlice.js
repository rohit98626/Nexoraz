import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import graphService from '../../services/graphService';

export const fetchGraphs = createAsyncThunk(
  'graph/fetchGraphs',
  async (_, thunkAPI) => {
    try {
      return await graphService.getGraphs();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchGraph = createAsyncThunk(
  'graph/fetchGraph',
  async (graphId, thunkAPI) => {
    try {
      return await graphService.getGraph(graphId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createGraph = createAsyncThunk(
  'graph/createGraph',
  async (graphData, thunkAPI) => {
    try {
      return await graphService.createGraph(graphData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addNode = createAsyncThunk(
  'graph/addNode',
  async ({ graphId, nodeData }, thunkAPI) => {
    try {
      return await graphService.addNode(graphId, nodeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const graphSlice = createSlice({
  name: 'graph',
  initialState: {
    graphs: [],
    currentGraph: null,
    loading: false,
    error: null,
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
        state.error = action.payload.error;
      })
      .addCase(fetchGraph.fulfilled, (state, action) => {
        state.currentGraph = action.payload;
      })
      .addCase(createGraph.fulfilled, (state, action) => {
        state.graphs.push(action.payload);
      })
      .addCase(addNode.fulfilled, (state, action) => {
        if (state.currentGraph) {
          state.currentGraph.nodes.push(action.payload);
        }
      });
  },
});

export default graphSlice.reducer;