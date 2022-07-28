import styleCenter from './index.module.css'

import type { FC } from 'react'

type CenterProps = {
  children?: React.ReactNode
}

export const Center: FC<CenterProps> = ({ children }) => {
  return <div className={styleCenter.center}>{children}</div>
}
