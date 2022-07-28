import { CheckboxWithLabel } from '@/components/checkboxwithlabel'
import { LabelGrid } from '@/components/labelgrid'

import type { ChangeEventHandler, FC } from 'react'

import { PrefecturesData } from '~/types'

type RenderPrefectureProps = {
  prefectures: PrefecturesData[]
  changefunc: ChangeEventHandler<HTMLInputElement>
}

export const RenderPrefecture: FC<RenderPrefectureProps> = (props) => {
  return (
    <>
      {props.prefectures.length ? (
        <LabelGrid>
          {props.prefectures.map((prefecture) => (
            <CheckboxWithLabel
              prefCode={prefecture.prefCode}
              changefunc={props.changefunc}
              prefName={prefecture.prefName}
              key={prefecture.prefName}
            />
          ))}
        </LabelGrid>
      ) : (
        <span>をローディング中・・・</span>
      )}
    </>
  )
}
