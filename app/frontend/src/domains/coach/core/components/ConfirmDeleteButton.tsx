import { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOutsideClickDismiss } from "../hooks/useOutsideClickDismiss";

interface ConfirmDeleteProps {
  onDeleteConfirmed: () => void;
  tooltipText: string;
  confirmText: string;
}

export function ConfirmDeleteButton({
  onDeleteConfirmed,
  tooltipText,
  confirmText,
}: ConfirmDeleteProps) {
  const [hovered, setHovered] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useOutsideClickDismiss([dialogRef], () => {
    setConfirmOpen(false);
  });

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => !confirmOpen && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          setHovered(false);  
          setConfirmOpen(true);
        }}
        className="p-2 cursor-pointer"
        aria-label={tooltipText}
      >
        <DeleteIcon sx={{ color: "red", fontSize: 28 }} />
      </button>

      {/* Tooltip */}
      {hovered && !confirmOpen && (
        <div className="absolute bottom-full mb-2 px-2 py-2 bg-black text-white text-sm rounded whitespace-nowrap">
          {tooltipText}
        </div>
      )}

      {confirmOpen && (
        <div 
          className="absolute bottom-full mb-1 w-[240px] p-3 bg-white border rounded shadow-lg"
          ref={dialogRef}
        >
          <p className="mb-4 text-center">
            {confirmText}
          </p>
          <div className="flex justify-around">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteConfirmed();
                setConfirmOpen(false);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
