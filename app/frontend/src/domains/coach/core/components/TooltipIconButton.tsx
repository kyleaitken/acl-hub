import React, { useId } from "react";
import { Tooltip, PlacesType } from "react-tooltip";

interface TooltipIconButtonProps {
  tooltipContent: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  buttonClassName?: string;
  tooltipPosition?: PlacesType;      
  placementOffset?: number;   
  disabled?: boolean;
  children: React.ReactNode;
}

export default function TooltipIconButton({
  tooltipContent,
  onClick,
  "aria-label": ariaLabel,
  buttonClassName,
  children,
  tooltipPosition = "top",
  disabled = false,
  placementOffset = 10,
}: TooltipIconButtonProps) {
  const tooltipId = useId();

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={buttonClassName}
        disabled={disabled}

        // attach tooltip to this element
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
        data-tooltip-place={tooltipPosition}
        data-tooltip-offset={placementOffset}
      >
        {children}
      </button>
      <Tooltip id={tooltipId} style={{fontSize: 12, fontWeight: "normal", backgroundColor: 'black', opacity: 0.99, zIndex: 20000}}/>
    </>
  );
}
