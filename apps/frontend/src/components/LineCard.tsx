'use client'

import { FC } from 'react'
import { Button } from '@tmlmobilidade/ui'

type Props = {
  line: any
  isFavorite: boolean
  onToggleFavorite: () => void
}

export const LineCard: FC<Props> = ({ line, isFavorite, onToggleFavorite }) => (
  <div className="p-4 border rounded mb-2 flex justify-between items-center">
    <div>{line.name}</div>
    <Button onClick={onToggleFavorite}>
      {isFavorite ? 'Desfavoritar' : 'Favoritar'}
    </Button>
  </div>
)

