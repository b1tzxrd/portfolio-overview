import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { remove } from "../../slice/portfolioSlice";
import { useWebSocket } from "../../hooks/useWebsocket";
import { FixedSizeList as List } from "react-window";
import styles from "./portfolio.module.scss";

const Portfolio: React.FC = () => {
    const dispatch = useAppDispatch();
    const portfolio = useAppSelector((state) => state.portfolio.active);
    const symbols = useAppSelector((state) => state.portfolio.symbols);
    const prices = useWebSocket(symbols);

    if (portfolio.length === 0) {
        return (
            <main className={styles.portfolio__empty}>
                <h2>Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!</h2>
            </main>
        );
    }

    const totalPortfolioValue = portfolio.reduce((sum, asset) => {
        const livePrice = prices[asset.symbol]?.price ?? asset.price;
        return sum + asset.count * livePrice;
    }, 0);

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const asset = portfolio[index];
        const livePrice = prices[asset.symbol]?.price ?? asset.price;
        const percentage = prices[asset.symbol]?.percent ?? asset.percentage;
        const assetValue = asset.count * livePrice;
        const portfolioShare = ((assetValue / totalPortfolioValue) * 100).toFixed(2);

        return (
            <ul key={asset.id} style={style} className={styles.portfolio__list} onClick={() => dispatch(remove(asset.id))}>
                <li>{asset.symbol}</li>
                <li>{asset.count} шт.</li>
                <li>${livePrice.toFixed(2)}</li>
                <li>${assetValue.toFixed(2)}</li>
                <li style={{ color: percentage >= 0 ? "green" : "red" }}>
                    {percentage >= 0 ? "+" : ""}
                    {percentage.toFixed(2)}%
                </li>
                <li>{portfolioShare}%</li>
            </ul>
        );
    };

    return (
        <main className={styles.portfolio}>
            <ul className={styles.portfolio__list}>
                <li>Актив</li>
                <li>Количество</li>
                <li>Цена</li>
                <li>Общая стоимость</li>
                <li>Изм. за 24 ч.</li>
                <li>% портфеля</li>
            </ul>
            <div className={styles.portfolio__actives__list}>
                <List
                    height={500}
                    itemCount={portfolio.length} 
                    itemSize={50} 
                    width="100%" 
                    outerElementType="ul"
                >
                    {Row}
                </List>
            </div>
        </main>
    );
};

export default Portfolio;
