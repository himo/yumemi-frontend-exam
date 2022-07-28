import styleLabelGrid from './index.module.css'

import type { FC } from 'react'

type LabelGridProps = {
  children?: React.ReactNode
}

export const LabelGrid: FC<LabelGridProps> = ({ children }) => {
  return <div className={styleLabelGrid.labelgrid}>{children}</div>
}
