import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store/store";
import { BASE_URL } from "../config/config";

interface IActive {
    id: string
    symbol: string; 
    baseAsset: string; 
    quoteAsset: string;
    lastPrice: number;
    priceChange: number; 
    priceChangePercent: number; 
}

const activeAdapter = createEntityAdapter<IActive, string>({
    selectId: (active) => active.symbol,
})


interface IActiveState extends EntityState<IActive, string> {
    activeLoadingStatus: 'idle' | 'loading' | 'error';
}

const initialState: IActiveState = activeAdapter.getInitialState({ activeLoadingStatus: 'idle' })


export const fetchActives = createAsyncThunk<IActive[], void, { rejectValue: string }>(
    'actives/fetchActives',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get<IActive[]>(`${BASE_URL}/ticker/24hr`);
            return res.data
                .filter((active) => active.symbol.endsWith("USDT") && Number(active.lastPrice) > 0)
                .map((active) => ({
                    id: active.symbol,
                    symbol: active.symbol,
                    baseAsset: active.symbol.replace("USDT", ""),
                    quoteAsset: "USDT",
                    lastPrice: Number(active.lastPrice),
                    priceChange: Number(active.priceChange),
                    priceChangePercent: Number(active.priceChangePercent),
                })).slice(0, 50);


        } catch (error) {
            return rejectWithValue(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || "Ошибка при загрузке активов"
                    : "Неизвестная ошибка"
            );
        }
    }
)


const activeSlice = createSlice({
    initialState,
    name: 'actives',
    reducers: {},
    extraReducers: (build) => {
        build.addCase(fetchActives.pending, state => {
            state.activeLoadingStatus = 'loading'
        })
        build.addCase(fetchActives.fulfilled, (state, action) => {
            state.activeLoadingStatus = 'idle'
            activeAdapter.setAll(state, action.payload);
        })
        build.addCase(fetchActives.rejected, (state) => {
            state.activeLoadingStatus = 'error'
        })
    }
})


export default activeSlice.reducer
export const {
    selectAll: selectAllActives,
    selectById: selectActiveById
} = activeAdapter.getSelectors<RootState>(state => state.actives)

