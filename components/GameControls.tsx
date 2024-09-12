import { Button } from '@/components/ui/button'
import { Timer } from './Timer'

export default function GameControls() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Timer />
      <div className="flex space-x-2">
        <Button variant="outline">Check</Button>
        <Button variant="outline">Reveal</Button>
        <Button>Submit</Button>
      </div>
    </div>
  )
}