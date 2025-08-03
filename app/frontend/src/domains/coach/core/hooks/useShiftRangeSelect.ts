import { useRef } from "react";

export interface UseShiftRangeSelectParams<Item, ID> {
  items: Item[];
  selectedIds: ID[];
  onChange: (next: ID[]) => void;
  getId: (item: Item) => ID;
  getPosition: (item: Item) => number;
}

export function useShiftRangeSelect<Item, ID>({
  items,
  selectedIds,
  onChange,
  getId,
  getPosition,
}: UseShiftRangeSelectParams<Item, ID>) {
  const lastClickRef = useRef<ID | null>(null);

  const handleClick = (clickedId: ID, isShift: boolean, clickedPos: number) => {
    if (!isShift || selectedIds.length === 0 || lastClickRef.current == null) {
      return toggleSelect();
    }

    function toggleSelect () {
      const next = selectedIds.includes(clickedId)
      ? selectedIds.filter(id => id !== clickedId)
      : [...selectedIds, clickedId];

      lastClickRef.current = clickedId;

      return onChange(next);
    }

    // SHIFT-click: find nearest already-selected item by position
    // build array of {id, pos} for all other selected
    const others = selectedIds
      .filter(id => id !== clickedId)
      .map(id => {
        const it = items.find(i => getId(i) === id)!;
        return { id, pos: getPosition(it) };
      });

    if (others.length === 0) {
      return toggleSelect()
    }

    // all items with a lower position
    const lower = others.filter(o => o.pos < clickedPos);
    if (lower.length === 0) {
      return toggleSelect();
    }

    const nearestBelow = lower.reduce((best, curr) =>
      curr.pos > best.pos ? curr : best
    );

    const low = nearestBelow.pos;
    const high = clickedPos;

    const inRangeIds = items
      .filter(i => {
        const p = getPosition(i);
        return p >= low && p <= high;
      })
      .map(i => getId(i));

    // merge with existing (keeps any others outside the range)
    const nextSet = new Set<ID>([...selectedIds, ...inRangeIds]);
    lastClickRef.current = clickedId;
    return onChange(Array.from(nextSet));
  };

  return handleClick;
}
