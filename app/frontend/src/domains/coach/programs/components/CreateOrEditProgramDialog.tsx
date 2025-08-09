import { Dialog, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';

interface CreateOrEditProgramDialogProps {
  open: boolean;
  closeDialog: () => void;
  submitProgram: (
    programName: string,
    programDescription: string,
    programWeeks: string,
  ) => void;
  initialValues?: {
    programName: string;
    programDescription?: string;
    programWeeks: string;
  };
  onExited?: () => void;
}

const CreateOrEditProgramDialog = ({
  open,
  closeDialog,
  submitProgram,
  initialValues,
  onExited
}: CreateOrEditProgramDialogProps) => {
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programWeeks, setProgramWeeks] = useState('');

  useEffect(() => {
    if (initialValues) {
      setProgramName(initialValues.programName || '');
      setProgramDescription(initialValues.programDescription || '');
      setProgramWeeks(initialValues.programWeeks || '');
    } else {
      setProgramName('');
      setProgramDescription('');
      setProgramWeeks('');
    }
  }, [initialValues, open]);

  return (
    <Dialog 
      open={open} 
      fullWidth 
      maxWidth="lg" 
      onClose={closeDialog} 
      sx={{ml: '200px'}}
      TransitionProps={{
        onExited: onExited
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '22px' }}>
        {initialValues ? 'Edit program' : 'Create new program'}
      </DialogTitle>
      <form
        className="pb-8 pl-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitProgram(programName, programDescription, programWeeks);
          closeDialog();
        }}
      >
        <p className="font-bold">Program name</p>
        <input
          placeholder="Enter a name"
          required
          type="text"
          onChange={(e) => setProgramName(e.target.value)}
          value={programName}
          className="mb-5 min-h-[45px] w-[90%] border p-2 pl-3 rounded-sm"
        />
        <p className="font-bold">{'Program length (weeks)'}</p>
        <input
          placeholder="Enter the number of weeks"
          type="number"
          required
          onChange={(e) => setProgramWeeks(e.target.value)}
          value={programWeeks}
          className="mb-5 min-h-[45px] w-[90%] border p-2 pl-3 rounded-sm"
        />
        <p className="font-bold">Program description (optional)</p>
        <textarea
          placeholder="Enter a description"
          onChange={(e) => setProgramDescription(e.target.value)}
          value={programDescription}
          className="min-h-[45px] w-[90%] border p-2 pl-3 rounded-sm"
        />
        <div className="mt-5">
          <button
            type="submit"
            className="mr-5 h-[40px] w-[150px] rounded-md border bg-[var(--blue-button)] px-3 py-2 text-white cursor-pointer"
          >
            Save Program
          </button>
          <button
            onClick={() => {
              closeDialog();
            }}
            type="button"
            className="mr-10 h-[40px] w-[110px] rounded-md border bg-red-500 px-3 py-2 text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateOrEditProgramDialog;
