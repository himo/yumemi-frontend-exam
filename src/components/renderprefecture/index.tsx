import type { ChangeEventHandler, FC } from 'react'
import { PrefecturesData } from '~/types'
import { CheckboxWithLabel } from '../checkboxwithlabel'
import { LabelGrid } from '../labelgrid'

type RenderPrefectureProps = {
  prefectures: PrefecturesData[]
  changefunc: ChangeEventHandler<HTMLInputElement>
}

export const RenderPrefecture: FC<RenderPrefectureProps> = (props) => {
  return (
    <LabelGrid>
      {props.prefectures.map((prefecture) => (
        <CheckboxWithLabel
          prefCode={prefecture.prefCode}
          changefunc={props.changefunc}
          prefName={prefecture.prefName}
        />
      ))}
    </LabelGrid>
  )
}
