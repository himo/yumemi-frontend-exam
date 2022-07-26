import type { FC } from 'react'
import styleCard from './index.module.css'

type CardProps = {
  children?: React.ReactNode
}

export const Card: FC<CardProps> = ({ children }) => {
  return <div className={styleCard.card}>{children}</div>
}
