import { PrefectureAPIResponse } from '~/types'

export const getRESASApiResponseResult = <T>(res: any): PrefectureAPIResponse<T> => {
  if (res.data === '400' || res.data.result === null) {
    return { message: 'パラメータが間違っています', result: undefined }
  } else if (res.data === '404' || res.data.statusCode === '404') {
    return {
      message:
        'URLに該当するAPIがありません。アドレスに誤りはないかバージョンアップにより廃止されていないかご確認ください。',
      result: undefined,
    }
  } else if (res.data === '403' || res.data.statusCode === '403') {
    /*
     *API詳細説明にはAPIキーがないとき、無効なときに出るとあるがそれ以外でも表示されることがあるためURLの間違いを追加
     *例:https://opendata.resas-portal.go.jp/api/v1
     */
    return {
      message:
        'APIキーが無効、またはURLが間違っている可能性があります。必要があれば管理者にお問い合わせください。',
      result: undefined,
    }
  } else if ('message' in res.data && res.message != null) {
    return {
      message: 'APIキーの利用可能上限を超えました。期間をおいてまたお試しください',
      result: undefined,
    }
  } else {
    return { message: 'success', result: res.data.result }
  }
}
