import styles from './header.module.scss'

interface IHeaderProps {
    onOpenModal: (isOpen: boolean) => void
}

const Header: React.FC<IHeaderProps> = ({onOpenModal}) => {


    return (
        <>
            <header className={styles.header} >
                <h1 className={styles.title}> Portfolio Overview </h1>
                <button onClick={() => {
                    onOpenModal(true)
                }} className={styles.button}> добавить </button>
            </header>
        </>
    )
}

export default Header   