import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterViewMode = 'all' | 'filter' | 'sort' | 'openOnly';


interface InventoryState {
    stagedFilter: string;
    commitFilter: string;
    stagedSort: string;
    commitSort: string;
    stagedOpenOnly: boolean;
    commitOpenOnly: boolean;
    showFilters: boolean;
    filterViewMode: FilterViewMode; 
}

const initialState: InventoryState = {
    stagedFilter : 'all',
    commitFilter : 'all',
    stagedSort: 'Recommended',
    commitSort: 'Recommended',
    stagedOpenOnly: false,
    commitOpenOnly: false,
    showFilters: false,
    filterViewMode : 'all'
};

const searchSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setStagedSort(state, action: PayloadAction<string>) {
            state.stagedSort = action.payload;
        },

        setStagedFilter(state, action: PayloadAction<string>) {
            state.stagedFilter = action.payload;
        },

        setStagedOpenOnly(state, action: PayloadAction<boolean>) {
            state.stagedOpenOnly = action.payload;
        },

        clearFilters(state) {
            if(state.filterViewMode === 'all') {
                state.stagedFilter = 'all';
                state.stagedSort = 'Recommended';
                state.stagedOpenOnly = false;
            }else if(state.filterViewMode === 'filter') {
                state.stagedFilter = 'all';
            }else if(state.filterViewMode === 'sort') {
                state.stagedSort = 'Recommended';
            }else if(state.filterViewMode === 'openOnly') {
                state.stagedOpenOnly = false;
            }
        },

        clearAllFilters (state) {
            state.commitFilter = 'all';
            state.commitSort = 'Recommended';
            state.commitOpenOnly = false;
            state.stagedFilter = 'all';
            state.stagedSort = 'Recommended';
            state.stagedOpenOnly = false;
        },

        setShowFilters(state, action: PayloadAction<boolean>) {
            state.showFilters = action.payload;
        },

        commitFilters (state) {
            state.commitFilter = state.stagedFilter;
            state.commitSort = state.stagedSort;
            state.commitOpenOnly = state.stagedOpenOnly;
            state.showFilters = false;
        },

        setCommitFiltersToStaged (state) {
            state.stagedFilter = state.commitFilter;
            state.stagedSort = state.commitSort;
            state.stagedOpenOnly = state.commitOpenOnly;
        },

        setFilterViewMode(state, action: PayloadAction<FilterViewMode>) {
            state.filterViewMode = action.payload;
            state.showFilters = true; 
        },
    }
});

export const {
    setStagedFilter, 
    setStagedSort,
    setStagedOpenOnly,
    clearFilters,
    setShowFilters,
    commitFilters,
    setCommitFiltersToStaged,
    clearAllFilters,
    setFilterViewMode
} = searchSlice.actions;

export default searchSlice.reducer;
