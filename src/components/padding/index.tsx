import type { FC } from 'react'
import stylePadding from './index.module.css'

type PaddingProps = {
  children?: React.ReactNode
}

export const Padding: FC<PaddingProps> = ({ children }) => {
  return <div className={stylePadding.padding}>{children}</div>
}
