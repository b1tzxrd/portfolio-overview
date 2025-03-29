import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchActives, selectAllActives } from "../../slice/activesSlice";
import { useWebSocket } from "../../hooks/useWebsocket";
import { add as addToPortfolio } from "../../slice/portfolioSlice"; 

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const actives = useAppSelector(selectAllActives);
    const activesLoadingStatus = useAppSelector(state => state.actives.activeLoadingStatus);
    const portfolioSymbols = useAppSelector(state => state.portfolio.symbols);
    const prices = useWebSocket(portfolioSymbols);

    const [search, setSearch] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<{ symbol: string; price: number } | null>(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        dispatch(fetchActives());
    }, [dispatch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredActives = actives.filter(
        (item) =>
            item.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectAsset = (symbol: string, price: number) => {
        setSelectedAsset({ symbol, price });
        setAmount(""); 
    };

    const handleAddToPortfolio = () => {
        if (selectedAsset && amount && parseFloat(amount) > 0) {
            dispatch(addToPortfolio({
                symbol: selectedAsset.symbol,
                count: parseFloat(amount), 
                price: selectedAsset.price
            }));
            onClose();
        }
    };

    return createPortal(
        <div className={styles.modal__wrapper} onClick={onClose}>
            <div className={styles.modal__currency__list} onClick={(e) => e.stopPropagation()}>
                <input
                    className={styles.modal__input}
                    type="text"
                    placeholder="Поиск валюты"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className={styles.modal__list}>
                    {filteredActives.length > 0 ? (
                        filteredActives.map((item) => (
                            <div
                                key={item.id}
                                className={styles.modal__item}
                                onClick={() => handleSelectAsset(item.symbol, prices[item.symbol]?.price || item.lastPrice)}
                            >
                                <span>{item.symbol}</span>
                                <span>${prices[item.symbol]?.price || item.lastPrice}</span>
                                <span
                                    style={{ color: (prices[item.symbol]?.percent ?? item.priceChangePercent) >= 0 ? "green" : "red" }}
                                >
                                    {(prices[item.symbol]?.percent ?? item.priceChangePercent) >= 0 ? "+" : ""}
                                    {prices[item.symbol]?.percent ?? item.priceChangePercent}%
                                </span>
                            </div>
                        ))
                    ) : activesLoadingStatus === "loading" ? (
                        <div className={styles.modal__loading}>
                            <span>Загрузка...</span>
                        </div>
                    ) : (
                        <div className={styles.modal__empty}>
                            <span>Ничего не найдено</span>
                        </div>
                    )}
                </div>

                {selectedAsset && (
                    <div className={styles.modal__content} >
                        <div className={styles.modal__form}>
                            <div>
                                <span>{selectedAsset.symbol}  </span>
                                <span>${selectedAsset.price.toFixed(2)}</span>
                            </div>

                            <input
                                className={styles.modal__input}
                                type="number"
                                required
                                min="1"
                                step="1"
                                max="1000"
                                placeholder="Количество"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />

                            <div className={styles.modal__buttons_group}>
                                <button
                                    className={styles.modal__btn}
                                    onClick={handleAddToPortfolio}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                >
                                    добавить
                                </button>
                                <button className={styles.modal__btn} onClick={() => {
                                    setSelectedAsset(null)
                                    onClose()
                                }}>
                                    отмена
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById("modal-root") as HTMLDivElement
    );
};

export default Modal;
