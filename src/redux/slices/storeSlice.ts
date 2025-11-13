import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryState {
    keyword: string;
    stagedFilters: string[];
    appliedFilters: string[];
    selectedCuisine: string;
    stagedSort: string;
    appliedSort: string;
    showFilters: boolean;
    isFiltersApplied: boolean;
}

const initialState: InventoryState = {
    keyword: '',
    stagedFilters : [],
    appliedFilters : [],
    selectedCuisine: '',
    stagedSort: 'Recommended',
    appliedSort: 'Recommended',
    showFilters: false,
    isFiltersApplied: false
};

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        setKeyword(state, action: PayloadAction<string>) {
            state.keyword = action.payload;
        },
        setStagedSort(state, action: PayloadAction<string>) {
            state.stagedSort = action.payload;
        },
        setStagedFilters(state, action: PayloadAction<string>) {
            state.stagedFilters = state.stagedFilters.includes(action.payload) 
                ? 
                    state.stagedFilters.filter(item => item !== action.payload)
                : 
                    [...state.stagedFilters , action.payload]
        },
        setSelectedCuisine(state, action: PayloadAction<string>) {
            state.selectedCuisine = action.payload;
        },

        clearFilters(state) {
            state.stagedFilters = [];
            state.stagedSort = 'Recommended';
        },
        setShowFilters(state, action: PayloadAction<boolean>) {
            state.showFilters = action.payload;
        },
        setIsFiltersApplied (state , action: PayloadAction<boolean>) {
            state.isFiltersApplied = action.payload;
        },
        commitFilters (state) {
            state.appliedFilters = state.stagedFilters;
            state.appliedSort = state.stagedSort;
            state.isFiltersApplied = !(state.stagedFilters.length === 0 && state.stagedSort === 'Recommended')
        },
        setCommitFiltersToStaged (state) {
            state.stagedFilters = state.appliedFilters;
            state.stagedSort = state.appliedSort;
        }
    }
});

export const {
    setKeyword,
    setStagedSort,
    clearFilters,
    setShowFilters,
    setStagedFilters, 
    setSelectedCuisine,
    setIsFiltersApplied,
    commitFilters,
    setCommitFiltersToStaged
} = storeSlice.actions;

export default storeSlice.reducer;
