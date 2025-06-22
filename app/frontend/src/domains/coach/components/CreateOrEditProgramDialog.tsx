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
}

const CreateOrEditProgramDialog = ({
  open,
  closeDialog,
  submitProgram,
  initialValues,
}: CreateOrEditProgramDialogProps) => {
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programWeeks, setProgramWeeks] = useState('');

  console.log('initial', initialValues);

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
    <Dialog open={open} fullWidth onClose={closeDialog}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '22px' }}>
        {initialValues ? 'Edit Program' : 'Create Program'}
      </DialogTitle>
      <form
        className="pb-8 pl-6"
        onSubmit={(e) => {
          e.preventDefault();
          submitProgram(programName, programDescription, programWeeks);
          closeDialog();
        }}
      >
        <p className="font-bold">Program Name</p>
        <input
          placeholder="Enter a name"
          required
          type="text"
          onChange={(e) => setProgramName(e.target.value)}
          value={programName}
          className="mb-5 min-h-[45px] w-[90%] border p-2 pl-3"
        />
        <p className="font-bold">{'Program Length (Weeks)'}</p>
        <input
          placeholder="Enter the number of weeks"
          type="number"
          required
          onChange={(e) => setProgramWeeks(e.target.value)}
          value={programWeeks}
          className="mb-5 min-h-[45px] w-[90%] border p-2 pl-3"
        />
        <p className="font-bold">Program Description (Optional)</p>
        <textarea
          placeholder="Enter a description"
          onChange={(e) => setProgramDescription(e.target.value)}
          value={programDescription}
          className="min-h-[45px] w-[90%] border p-2 pl-3"
        />
        <div className="mt-5">
          <button
            type="submit"
            className="mr-5 h-[40px] w-[150px] rounded-md border bg-[#4e4eff] px-3 py-2 text-white"
          >
            Save Program
          </button>
          <button
            onClick={() => {
              closeDialog();
            }}
            type="button"
            className="mr-10 h-[40px] w-[110px] rounded-md border bg-red-500 px-3 py-2 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateOrEditProgramDialog;
