import { useRef, useState } from "react";
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
  const { addExercise } = useExercisesActions();

  const previewRef = useRef<HTMLDivElement>(null);
    
  useOutsideClickDismiss([previewRef], () => {
    handleDismiss();
  });

  const handleSaveExerciseToLibrary = async () => {
    try {
      await addExercise({ name: title.trim(), videoUrl: embedUrl })
      .then((newEx) => {
        onSaveExercise(newEx);     
        handleDismiss();                
      })
    } catch (e) {
      toast.error("Unable to save new exercise")
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
      <p className='font-bold text-lg'>{title}</p>
      <div className="flex flex-col mt-2">
        <label htmlFor="videoUrl" className="text-sm font-semibold mb-1">
          Video url
        </label>
        <input 
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="outline-[1.5px] outline-gray-300 rounded hover:outline-gray-700 pl-2 py-1 focus:outline-2 focus:outline-blue-500 focus:shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]"
        />
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
          className="rounded bg-[#4e4eff] text-white text-sm px-2 py-1 cursor-pointer mr-2 hover:bg-blue-800"
          onClick={handleSaveExerciseToLibrary}
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

export default AddNewExerciseDialog;