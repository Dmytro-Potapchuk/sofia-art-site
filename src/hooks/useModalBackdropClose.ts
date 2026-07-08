import { useRef } from 'react';

export function useModalBackdropClose(onClose: () => void) {
  const backdropPointerDown = useRef(false);

  return {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      backdropPointerDown.current = event.target === event.currentTarget;
    },
    onClick: (event: React.MouseEvent<HTMLDivElement>) => {
      if (
        event.target === event.currentTarget &&
        backdropPointerDown.current
      ) {
        onClose();
      }
    },
  };
}
