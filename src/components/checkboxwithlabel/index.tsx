import styleCheckboxWithLabelProps from './index.module.css'

import type { ChangeEventHandler, FC } from 'react'

type CheckboxWithLabelProps = {
  prefCode: number
  changefunc: ChangeEventHandler<HTMLInputElement>
  prefName: string
}

export const CheckboxWithLabel: FC<CheckboxWithLabelProps> = (props) => {
  return (
    <label className={styleCheckboxWithLabelProps.label}>
      <input
        type="checkbox"
        className={styleCheckboxWithLabelProps.input}
        value={props.prefCode}
        onChange={props.changefunc}
      />
      {props.prefName}
    </label>
  )
}
