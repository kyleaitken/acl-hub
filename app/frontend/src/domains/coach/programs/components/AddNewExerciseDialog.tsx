import { useEffect, useRef, useState } from "react";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";
import { getEmbedUrl } from "../../core/utils/text";
import { isTrustedVideoUrl } from "../../core/utils/text";
import { useExercisesActions } from "../../libraries/features/exercises/hooks/useExercisesActions";
import { Exercise } from "../../libraries/features/exercises/types";
import toast from "react-hot-toast";

interface AddNewExerciseDialogProps {
  handleDismiss: () => void;
  onSaveExercise: (exercise: Exercise) => void;
  anchorRect: DOMRect;
  title: string;
}

const AddNewExerciseDialog = ({anchorRect, title, handleDismiss, onSaveExercise}: AddNewExerciseDialogProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showError, setShowError] = useState(false);
  const { addExercise } = useExercisesActions();

  const previewRef = useRef<HTMLDivElement>(null);
    
  useOutsideClickDismiss([previewRef], () => {
    handleDismiss();
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSaveExerciseToLibrary = async () => {
    if (!validUrl) {
      setShowError(true);
      return;
    }
  
    setShowError(false);
    try {
      const newEx = await addExercise({ name: title.trim(), videoUrl: embedUrl });
      onSaveExercise(newEx);
      handleDismiss();
    } catch (e) {
      toast.error("Unable to save new exercise");
      console.error("Error while trying to save new exercise: ", e);
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const validUrl = isTrustedVideoUrl(videoUrl);
  
  return (
    <div
      ref={previewRef}
      className="fixed flex px-5 py-4 flex-col z-[100] border rounded bg-white shadow-lg"
      style={{
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.left + window.scrollX,
        width: 400,
      }}
    >
      <p className='font-bold text-[14px]'>{title}</p>
      <div className="flex flex-col mt-2">
        <label htmlFor="videoUrl" className="font-semibold text-[13px] mb-1">
          Video url
        </label>
        <input 
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            setShowError(false);
          }}
          className={`text-[13px] outline-[1.5px] rounded pl-2 py-1 
            ${showError ? "outline-red-500 focus:outline-red-500" : "outline-gray-300 hover:outline-gray-700 focus:outline-blue-500 focus:shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]"}`}
        />
        {showError && (
          <div className="text-red-600 text-[11px] mt-1">
            Please enter a valid video URL
          </div>
        )}
      </div>
      {validUrl&&
        <iframe
          title="Exercise Video Preview"
          src={embedUrl}
          allowFullScreen
          className="w-full rounded mt-3 h-[200px]"
        />
      }
      <div className="flex mt-3">
        <button
          type="button"
          className="text-xs rounded bg-[var(--blue-button)] text-white px-2 py-1 cursor-pointer mr-2 hover:bg-blue-800"
          onClick={handleSaveExerciseToLibrary}
        >
          Save to Library
        </button>
        <button
          className="text-xs rounded bg-white px-2 py-1 cursor-pointer hover:bg-gray-200"
          onClick={handleDismiss}
        >
          Cancel
        </button>
      </div>
    </div>  
  )
};

export default AddNewExerciseDialog;