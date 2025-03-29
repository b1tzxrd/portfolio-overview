import { ReactNode } from "react"
import styles from './container.module.scss'


interface ContainerProps {
    children: ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className={styles.container} >
            {children}
        </div>
    )
}

export default Container