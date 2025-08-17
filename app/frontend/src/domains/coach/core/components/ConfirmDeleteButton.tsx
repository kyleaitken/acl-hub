import { useRef, useState, forwardRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOutsideClickDismiss } from "../hooks/useOutsideClickDismiss";
import { Tooltip } from 'react-tooltip'
import clsx from "clsx";
import { useDisableScroll } from "../hooks/useDisableScroll";

export interface ConfirmDeleteButtonProps {
  tooltipText: string;
  confirmText: string;
  onDeleteConfirmed: () => void;
  iconSize?: number | string;
  iconColor?: string;
  iconClassName?: string;
  className?: string;
  buttonClassName?: string;
  cancelButtonClassName?: string;
  confirmButtonClassName?: string;
  dialogClassName?: string;
  tooltipClassName?: string;
  tooltipOffset?: number;
}

/**
 * A delete-button + tooltip + confirm-dialog combo.
 */
export const ConfirmDeleteButton = forwardRef<
  HTMLDivElement,
  ConfirmDeleteButtonProps
>(function ConfirmDeleteButton(
  {
    tooltipText,
    confirmText,
    onDeleteConfirmed,
    iconSize = 28,
    iconColor = "red",
    iconClassName,
    className,
    buttonClassName,
    cancelButtonClassName,
    confirmButtonClassName,
    dialogClassName,
    tooltipOffset = 5
  },
  ref
) {
  const [hovered, setHovered] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useOutsideClickDismiss([dialogRef], () => {
    setConfirmOpen(false);
  });

  useDisableScroll(confirmOpen);

  return (
    <div
      ref={ref}
      className={clsx("relative inline-block", className)}
      onMouseEnter={() => !confirmOpen && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          setHovered(false);
          setConfirmOpen(true);
        }}
        className={clsx("delete-anchor cursor-pointer", buttonClassName ?? "p-2")}
        aria-label={tooltipText}
      >
        <DeleteIcon
          className={iconClassName}
          sx={{ fontSize: iconSize, color: iconColor }}
        />
      </button>

      {hovered && !confirmOpen && (
        <Tooltip 
          place="top" 
          anchorSelect=".delete-anchor" 
          opacity={0.99} 
          style={{backgroundColor: 'red', fontSize: 12, fontWeight: 'normal'}}
          delayShow={200}
          offset={tooltipOffset}
        >
          {tooltipText}
        </Tooltip>
      )}

      {confirmOpen && (
        <div
          ref={dialogRef}
          className={clsx(
            "text-[12px] absolute bottom-full mb-1 w-[240px] p-3 bg-white border rounded shadow-lg",
            dialogClassName
          )}
        >
          <p className="mb-4 text-center">{confirmText}</p>
          <div className="flex justify-around">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className={clsx(
                "px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer",
                cancelButtonClassName
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteConfirmed();
                setConfirmOpen(false);
              }}
              className={clsx(
                "px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer",
                confirmButtonClassName
              )}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
