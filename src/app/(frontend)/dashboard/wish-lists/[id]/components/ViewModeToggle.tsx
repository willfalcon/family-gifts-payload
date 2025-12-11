'use client'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import useViewMode from '@/hooks/use-view-mode'
import { ButtonGroup } from '@/components/ui/button-group'

export default function ViewModeToggle() {
  const [viewMode, setViewMode] = useViewMode()

  return (
    <ButtonGroup>
      <Button
        variant={viewMode === 'detailed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('detailed')}
        className="cursor-pointer"
      >
        <LayoutGrid className="size-4" />
        {/* Detailed */}
      </Button>
      <Button
        variant={viewMode === 'compact' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('compact')}
        className="cursor-pointer"
      >
        <List className="size-4" />
        {/* Compact */}
      </Button>
    </ButtonGroup>
  )
}
