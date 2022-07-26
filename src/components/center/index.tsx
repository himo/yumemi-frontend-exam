import type { FC } from 'react'
import styleCenter from './index.module.css'

type CenterProps = {
  children?: React.ReactNode
}

export const Center: FC<CenterProps> = ({ children }) => {
  return <div className={styleCenter.center}>{children}</div>
}
