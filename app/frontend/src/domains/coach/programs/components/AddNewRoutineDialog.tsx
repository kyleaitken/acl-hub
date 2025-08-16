import { useRef, useState } from "react";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";

interface AddNewRoutineDialogProps {
  handleDismiss: () => void;
  handleSave: (name: string) => void;
  anchorRect: DOMRect;
}

const AddNewRoutineDialog = ({anchorRect, handleDismiss, handleSave}: AddNewRoutineDialogProps) => {
  const [name, setName] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);
    
  useOutsideClickDismiss([dialogRef], () => {
    handleDismiss();
  });
  
  return (
    <div
      ref={dialogRef}
      className="fixed flex px-5 pb-4 pt-2 flex-col z-[100] border rounded bg-white shadow-lg"
      style={{
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.left + window.scrollX,
        width: 300,
      }}
    >
      <div className="flex flex-col mt-2">
        <label htmlFor="routineName" className="text-sm font-semibold mb-1">
          Name
        </label>
        <input 
          placeholder="Enter a name"
          id="routineName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-sm outline-[1.5px] outline-gray-300 rounded hover:outline-gray-700 pl-2 py-1 focus:outline-2 focus:outline-blue-500 focus:shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]"
        />
      </div>
      <div className="flex mt-3">
        <button
          type="button"
          className="rounded bg-[var(--blue-button)] text-white text-sm px-2 py-1 cursor-pointer mr-2 hover:bg-blue-800"
          onClick={() => {
            handleSave(name)
            handleDismiss();
          }}
        >
          Save to Library
        </button>
        <button
          className="rounded bg-white text-sm px-2 py-1 cursor-pointer hover:bg-gray-200"
          onClick={handleDismiss}
        >
          Cancel
        </button>
      </div>
    </div>  
  )
};

export default AddNewRoutineDialog;