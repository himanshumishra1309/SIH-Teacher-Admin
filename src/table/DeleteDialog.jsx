import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function DeleteDialog({ isOpen, onClose, onConfirm, rowData }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h3>Confirm Deletion</h3>
        </DialogHeader>
        <p>Are you sure you want to delete the entry: {rowData?.Title}?</p>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button className="bg-red-500" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
