import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ currentPage, gender, available, selectedDomains }) => {
        const response = await axios.get(`https://heliverse-4zbw.onrender.com/api/user/get-users/${currentPage}`, {
            params: { gender, available, domain: selectedDomains },
        });
        return response.data;
    }
);

export const searchUserByName = createAsyncThunk(
    'users/searchUserByName',
    async (name, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://heliverse-4zbw.onrender.com/api/user/search`, {
                params: { name },
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`https://heliverse-4zbw.onrender.com/api/user/delete-users/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error);
        }
    }
);


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        searchResults: [],
        totalPages: 0,
        gender: '',
        available: '',
        selectedDomains: [],
        currentPage: 1,
        recentlyDeleted: false
    },
    reducers: {
        setGender: (state, action) => {
            state.gender = action.payload;
        },
        setAvailable: (state, action) => {
            state.available = action.payload;
        },
        setSelectedDomains: (state, action) => {
            state.selectedDomains = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetFilters: (state) => {
            state.gender = '';
            state.available = '';
            state.selectedDomains = [];
            state.currentPage = 1;
        },
        resetRecentlyDeleted: (state) => { state.recentlyDeleted = false; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload.users;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(searchUserByName.fulfilled, (state, action) => {
                state.searchResults = action.payload; // Assumes search results are stored here
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.meta.arg);
                state.recentlyDeleted = true;
            });
    },
});


export const { setGender, setAvailable, setSelectedDomains, setCurrentPage, resetFilters, searchResults, resetRecentlyDeleted } = usersSlice.actions;

export default usersSlice.reducer;