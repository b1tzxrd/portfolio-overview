import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from '../slice/portfolioSlice';
import activesReducer from '../slice/activesSlice';

export const store = configureStore({
    reducer: {
        portfolio: portfolioReducer,
        actives: activesReducer,
    }
});


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']