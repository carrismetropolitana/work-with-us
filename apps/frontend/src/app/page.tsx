import LinesGrid from '../components/LinesGrid'
import { getEnrichedLines } from '../lib/carris'
import { getFavorites } from '../lib/favorite'
import { CMIcon } from '@tmlmobilidade/ui'


export default async function Page() {
	const [lines, favorites] = await Promise.all([
    	getEnrichedLines(),
    	getFavorites(),
  	])

	const favoriteIds = favorites.map((f: { lineId: string }) => f.lineId)

  	return (
    	<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
			<div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
  				<CMIcon /><h1>Minha Carris Metropolitana</h1>
			</div>
      		<LinesGrid lines={lines} initialFavorites={favoriteIds} />
    	</div>
  	)
}
