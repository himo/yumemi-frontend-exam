export type PrefecturesData = {
  prefCode: number //                          1
  prefName: string //                          北海道
  selected?: boolean
  data?: { year: number; value: number }[] //  [{year: 2040,value: 4004973},...]
}

export type SeriesHighcharts = {
  name: string //         北海道
  data: number[] //       [5039206,5171800,...]
  visible: boolean
  showInLegend: boolean
}

export type PrefectureAPIResponse<T> = {
  message: string
  result: T | undefined
}

//以下AxiosResponseに渡すための型付けを行いたい要素についての型定義

export type PrefName = {
  prefCode: number // 1
  prefName: string // 北海道
}[]

export type PrefPopulation = {
  data: {
    data: {
      year: number //  2040
      value: number // 4004973
    }[]
  }[]
}
