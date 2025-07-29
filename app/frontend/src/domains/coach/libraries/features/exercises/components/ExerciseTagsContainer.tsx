import { useEffect, useRef, useState } from "react";
import { Exercise } from "../types";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import ExercisePreview from "./ExercisePreview";
import { getEmbedUrl } from "../../../../core/utils/text";

interface ExerciseTagsContainerProps {
  addedExercises: Exercise[];
  handleRemoveExercise: (id: number) => void;
  size?: Size;
  className?: string;
}

type Size = "small" | "medium" | "large";

const sizeConfig: Record<
  Size,
  {
    wrapperPadding: string;
    tagPadding: string;
    textSize: string;
    tagMargin: string;
    iconFontSize: number;
  }
> = {
  small: {
    wrapperPadding: "px-0 pb-0",
    tagPadding: "p-0.5",
    tagMargin: "mt-0.5 mr-0.5",
    textSize: "text-[10px]",
    iconFontSize: 14,
  },
  medium: {
    wrapperPadding: "px-4 pb-2",
    tagPadding: "p-1",
    tagMargin: "mt-1 mr-1",
    textSize: "text-sm",
    iconFontSize: 18,
  },
  large: {
    wrapperPadding: "px-3 pb-3",
    tagPadding: "px-4 py-2",
    tagMargin: "mt-1",
    textSize: "text-base",
    iconFontSize: 22,
  },
};

const ExerciseTagsContainer = ({addedExercises, handleRemoveExercise, size = "medium", className}: ExerciseTagsContainerProps) => {
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  
  const tagRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { wrapperPadding, tagPadding, tagMargin, textSize, iconFontSize } = sizeConfig[size];

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

  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setPreviewExercise(null);
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div 
      id="warmup-exercise-tags-wrapper" 
      className={`flex flex-wrap max-w-full ${wrapperPadding} ${className}`}
    >
      {addedExercises.map((exercise) => {
        const hasVideo = Boolean(exercise.video_url);

        return (
          <div 
            key={exercise.id}
            className={`flex items-center bg-gray-100 rounded-xl ${tagMargin} ${tagPadding}`}
            ref={(el) => (tagRefs.current[exercise.id] = el)}
          >
            {hasVideo && 
            <IconButton 
              onClick={() => handlePreviewToggle(exercise.id)}
              sx={{
                p: 0.5,
                '&:hover': {
                    backgroundColor: '#d1d5db'
                }
              }}
            >
                <VideocamIcon sx={{ fontSize: iconFontSize }} />
              </IconButton>
            }
            <span
              className={`${!hasVideo ? 'ml-1' : ""} ${textSize} px-1 font-semibold`}
            >
              {exercise.name}
            </span>
            <IconButton 
              size="small"
              onClick={() => handleRemoveExercise(exercise.id)}
              sx={{
              p: 0.5,
              '&:hover': {
                  backgroundColor: '#d1d5db' 
              }
              }}
            >
              <CloseIcon sx={{ fontSize: iconFontSize }} />
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