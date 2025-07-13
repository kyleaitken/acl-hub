import { useRef, useState } from "react";
import { Exercise } from "../../core/types/models";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import ExercisePreview from "../../core/components/ExercisePreview";
import { getEmbedUrl } from "../../core/utils/text";

interface ExerciseTagsContainerProps {
  addedExercises: Exercise[];
  handleRemoveExercise: (id: number) => void;
}

const ExerciseTagsContainer = ({addedExercises, handleRemoveExercise}: ExerciseTagsContainerProps) => {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  
  const tagRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handlePreviewToggle = (exerciseId: number) => {
    const tagEl = tagRefs.current[exerciseId];
    if (previewExercise?.id === exerciseId) {
      setPreviewExercise(null);
      setAnchorRect(null);
    } else if (tagEl) {
      const exercise = addedExercises.find((ex) => ex.id === exerciseId);
      setPreviewExercise(exercise || null);
      setAnchorRect(tagEl.getBoundingClientRect());
    }
  };

  return (
    <div id="warmup-exercise-tags-wrapper" className='flex flex-wrap max-w-full px-4 pb-4'>
      {addedExercises.map((exercise) => {
        const hasVideo = Boolean(exercise.video_url);

        return (
          <div 
            key={exercise.id}
            className='flex items-center justify-center bg-gray-100 rounded-xl mr-2 mt-2'
            ref={(el) => (tagRefs.current[exercise.id] = el)}
          >
            {hasVideo && 
            <IconButton 
              onClick={() => handlePreviewToggle(exercise.id)}
              sx={{
                py: 0.5, px: 1,
                '&:hover': {
                    backgroundColor: '#d1d5db'
                }
              }}
            >
              <VideocamIcon sx={{fontSize: '16px', p: 0}}/>
            </IconButton>
            }
            <span className={`${!hasVideo ? 'pl-3' : ''} text-xs font-semibold`}>{exercise.name}</span>
            <IconButton 
              onClick={() => handleRemoveExercise(exercise.id)}
              sx={{
              py: 0.5, px: 1,
              '&:hover': {
                  backgroundColor: '#d1d5db' 
              }
              }}
            >
              <CloseIcon sx={{fontSize: '16px'}} />
            </IconButton>
          </div>
        )
      })}

      {previewExercise && anchorRect && (
        <ExercisePreview 
          anchorRect={anchorRect}
          name={previewExercise.name}
          url={getEmbedUrl(previewExercise.video_url || '')}
          exerciseId={previewExercise.id}
          handleDismissPreview={() => setPreviewExercise(null)}
        />
      )}

    </div>
  )
};

export default ExerciseTagsContainer;