import { getRESASApiResponseResult } from '@/components/peges/getRESASApiResponseResult'
import axios, { AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrefPopulation } from '~/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await axios
    .get(
      'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode='.concat(
        String(req.query.id),
      ),
      { headers: { 'X-API-KEY': process.env.API_KEY as string } },
    )
    .then((response: AxiosResponse<PrefPopulation>) => {
      const resultResponse = getRESASApiResponseResult<PrefPopulation>(response)
      res.status(200).json({ message: resultResponse.message, result: resultResponse.result })
    })
    .catch(() => {
      res.status(200).json({
        message: 'ネットワークエラー、またはURLがまちがっている可能性があります。',
        result: undefined,
      })
    })
}
