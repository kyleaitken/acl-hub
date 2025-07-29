import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";

type Omitted = "title" | "children" | "onClick";
type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipIconButtonProps
  extends Omit<TooltipProps, Omitted> {
  title: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  buttonClassName?: string;
  tooltipPosition: TooltipPosition;
  children: React.ReactNode;
}

const offsetMap: Record<TooltipPosition, [number, number]> = {
  top: [0, -2],
  bottom: [0, -8],
  left: [8, 0],
  right: [-8, 0],
};

const TooltipIconButton = ({
  title,
  onClick,
  "aria-label": ariaLabel,
  buttonClassName,
  children,
  tooltipPosition,
  ...tooltipProps
}: TooltipIconButtonProps) => {
  return (
    <Tooltip
      title={title}
      slotProps={{
        tooltip: { sx: { fontSize: "1em", backgroundColor: "black" } },
        popper: {
          style: { pointerEvents: 'none' }, 
          modifiers: [
            {
              name: "offset",
              options: { offset: offsetMap[tooltipPosition] },
            },
          ],
        },
      }}
      {...tooltipProps}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={`${buttonClassName}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default TooltipIconButton;
