'use client'

import { useState } from 'react'
import { Button } from '@tmlmobilidade/ui'
import LineCard from './LineCard'
import type { EnrichedLine } from '../lib/carris'
import { addFavorite, removeFavorite } from '../lib/favorite'

interface LinesGridProps {
  lines: EnrichedLine[]
  initialFavorites: string[]
}