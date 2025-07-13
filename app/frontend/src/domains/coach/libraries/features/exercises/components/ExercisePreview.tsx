import { useRef } from "react";
import { useOutsideClickDismiss } from "../../../../core/hooks/useOutsideClickDismiss";

interface ExercisePreviewProps {
  anchorRect: DOMRect;
  name: string;
  url?: string;
  exerciseId: number;
  handleDismissPreview: () => void;
}

const ExercisePreview = ({anchorRect, name, url, exerciseId, handleDismissPreview}: ExercisePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  useOutsideClickDismiss([previewRef], () => {
    handleDismissPreview();
  });

  return (
    <div
      ref={previewRef}
      className="fixed flex px-5 py-4 flex-col z-[100] border rounded bg-white shadow-lg"
      style={{
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.left + window.scrollX,
        width: 400,
        height: 300,
      }}
    >
      <p className='font-bold text-lg'>{name}</p>
      <iframe
        title="Exercise Video Preview"
        src={url}
        allowFullScreen
        className="w-full h-full rounded"
      />
      <div className='text-xs mt-2'>
        <span>You can update this video from the </span>
        <a
          href={`/coach/library/exercises/${exerciseId}/edit`}
          className="text-blue-500 hover:underline"
        >
          exercise library.
        </a>
      </div>
    </div>
          
  )
};

export default ExercisePreview;