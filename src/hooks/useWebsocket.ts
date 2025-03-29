import { useEffect, useState, useRef } from "react";
import { BASE_WEBSOCKET_URL } from "../config/config";

interface PriceData {
    price: number;
    percent: number;
}

export const useWebSocket = (symbols: string[] = []) => {
    const [prices, setPrices] = useState<Record<string, PriceData>>({});
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!symbols || symbols.length === 0) return;

        const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join("/");
        const url = `${BASE_WEBSOCKET_URL}/${streams}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (!data.s || !data.c || !data.P) return; 

            const { s: symbol, c: price, P: percent } = data;

            setPrices(prev => ({
                ...prev,
                [symbol]: { price: parseFloat(price), percent: parseFloat(percent) }
            }));
        };

        ws.onerror = (error) => console.error("WebSocket error:", error);
        ws.onclose = () => console.log("WebSocket disconnected");

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [symbols]);

    return prices;
};
