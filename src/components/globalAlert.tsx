import { TriangleAlertIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'


const AlertDialogDestructiveDemo = ({open,onOpenChange,message, color,description}:{open: boolean, onOpenChange: (open: boolean) => void, message: string, color: string, description: string}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>

      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <div className='bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
          {color === 'red' ?
            <TriangleAlertIcon className='text-destructive size-6' />
            :
            <TriangleAlertIcon className='text-green-600 size-6' />
          }
          </div>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            {description}
            {/* <span className='mt-4 flex items-center justify-center gap-3'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>Don&apos;t ask next again</Label>
            </span> */}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogDestructiveDemo
