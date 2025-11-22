import { CheckCircle2 } from 'lucide-react';

import {
  AlertDialog,
    AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const AlertDialogSeccess = ({open, onOpenChange}: {open: boolean, onOpenChange: (open: boolean) => void}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className='flex items-center gap-2'>
                <CheckCircle2 className='size-8  text-green-600 dark:text-green-400' />
                          <AlertDialogTitle className='text-green-600 dark:text-green-400'>Success</AlertDialogTitle>
            </div>
          <AlertDialogDescription>
            Your request has been successfully submitted.
          </AlertDialogDescription>
          <ol className='text-muted-foreground mt-4 flex list-decimal flex-col gap-2 pl-6 text-sm'>
            <li className='text-left'>Please wait while we process your request.</li>
            <li className='text-left'>Don&apos;t forget to check your email for confirmation.</li>
          </ol>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogSeccess 
