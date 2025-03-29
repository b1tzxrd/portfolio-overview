import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IActive {
    id: string;
    symbol: string;
    name: string;
    count: number;
    price: number;
    totalAmount: number;
    update: number;
    percentage: number;
}

interface IState {
    active: IActive[];
    symbols: string[];
}

// Функция загрузки из localStorage
const loadFromStorage = (): IActive[] => {
    try {
        const data = localStorage.getItem("portfolio");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// Функция сохранения в localStorage
const saveToStorage = (state: IState) => {
    localStorage.setItem("portfolio", JSON.stringify(state.active));
};

const initialState: IState = {
    active: loadFromStorage(),
    symbols: loadFromStorage().map((a) => a.symbol), 
};

const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<{ symbol: string; count: number; price: number }>) => {
            const existingAsset = state.active.find((item) => item.symbol === action.payload.symbol);

            if (existingAsset) {
                existingAsset.count += action.payload.count;
                existingAsset.totalAmount = existingAsset.count * existingAsset.price;
            } else {
                const newAsset: IActive = {
                    id: crypto.randomUUID(),
                    symbol: action.payload.symbol,
                    name: action.payload.symbol,
                    count: action.payload.count,
                    price: action.payload.price,
                    totalAmount: action.payload.count * action.payload.price,
                    update: 0,
                    percentage: 0,
                };
                state.active.push(newAsset);
            }

            state.symbols = state.active.map((a) => a.symbol);
            saveToStorage(state);
        },
        remove: (state, action: PayloadAction<string>) => {
            state.active = state.active.filter((item) => item.id !== action.payload);
            state.symbols = state.active.map((a) => a.symbol);
            saveToStorage(state);
        },
        updatePrice: (state, action: PayloadAction<{ symbol: string; newPrice: number; percent: number }>) => {
            const asset = state.active.find((item) => item.symbol === action.payload.symbol);
            if (asset) {
                asset.price = action.payload.newPrice;
                asset.update = action.payload.percent;
                asset.totalAmount = asset.count * asset.price;
            }
        },
    },
});

export const { add, remove, updatePrice } = portfolioSlice.actions;
export default portfolioSlice.reducer;
