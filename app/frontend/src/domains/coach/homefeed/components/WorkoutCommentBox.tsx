import { Divider, Popover } from '@mui/material';
import ProfilePictureBubble from '../../../shared/components/ProfilePictureBubble';
import EditIcon from '@mui/icons-material/Edit';
import { formatDateToStringWithTime } from '../../core/utils/dateUtils';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useCoachWorkoutStore } from '../store/coachWorkoutStore';
import {
  AuthenticatedUser,
  useAuthenticatedUser,
} from '../../../shared/auth/hooks/useAuthenticatedUser';

interface WorkoutCommentBoxProps {
  workoutId: number;
  clientId: number;
  coachFirstName: string;
  coachLastName: string;
  clientFirstName: string;
  clientLastName: string;
  onAddComment: (newComment: string) => Promise<void>;
  onUpdateComment: (commentId: number, updatedComment: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

const WorkoutCommentBox = (props: WorkoutCommentBoxProps) => {
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    workoutId,
    clientId,
    coachFirstName,
    coachLastName,
    clientFirstName,
    clientLastName,
    onAddComment,
    onUpdateComment,
    onDeleteComment,
  } = props;

  const comments = useCoachWorkoutStore(
    (state) => state.updatedWorkoutComments[workoutId] || [],
  );

  const { id, role }: AuthenticatedUser = useAuthenticatedUser();

  function getCommentUserId(comment_user_type: string) {
    return comment_user_type === 'coach' ? id : clientId;
  }

  function getCommentName(user_type: string): string {
    const firstName = user_type === 'coach' ? coachFirstName : clientFirstName;
    let lastName = user_type === 'coach' ? coachLastName : clientLastName;
    return `${firstName.replace(/^./, (char) => char.toUpperCase())} ${lastName.replace(/^./, (char) => char.toUpperCase())}`;
  }

  function getCommentDateString(timestamp: Date): string {
    const date = new Date(timestamp);
    return formatDateToStringWithTime(date);
  }

  const handleEditComment = (commentId: number, commentContent: string) => {
    setEditCommentId(commentId);
    setEditCommentContent(commentContent);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditCommentContent('');
  };

  const handleAddComment = async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;
    await onAddComment(newComment);
    setNewComment('');
  };

  const handleUpdateComment = async (commentId: number) => {
    const trimmedComment = editCommentContent.trim();
    if (!trimmedComment) return;
    await onUpdateComment(commentId, trimmedComment);
    setEditCommentId(null);
  };

  const handleDeleteComment = async () => {
    if (commentToDelete) {
      setAnchorEl(null);
      await onDeleteComment(commentToDelete);
      setEditCommentId(null);
      setCommentToDelete(null);
    }
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLElement>,
    commentId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setCommentToDelete(commentId);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setCommentToDelete(null);
  };

  useEffect(() => {
    if (inputRef.current) {
      const length = editCommentContent.length;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(length, length);
    }
  }, [editCommentContent]);

  const buttonBase = 'h-9 w-20 cursor-pointer rounded-sm py-1';
  const buttonVariants = {
    cancel: `${buttonBase} border border-blue-500 text-blue-500 px-2`,
    save: `${buttonBase} bg-[var(--blue-button)] text-white`,
    delete: `${buttonBase} bg-red-500 text-white`,
  };

  return (
    <div className="workout-comments-wrapper mb-5">
      {comments.map((comment, index) => (
        <div className="comment ml-6 flex py-3" key={index}>
          <div className="mr-5">
            <ProfilePictureBubble
              userType={comment.user_type}
              userId={getCommentUserId(comment.user_type)}
              name={getCommentName(comment.user_type)}
              height={38}
            />
          </div>
          <div className="comment-content-box mr-10 flex-grow">
            <div className="comment-header flex items-center">
              <p className="comment-username font-bold">
                {getCommentName(comment.user_type)}
              </p>
              <p className="comment-date ml-3 flex-grow text-xs text-gray-500">
                {getCommentDateString(comment.timestamp)}
              </p>
              {role === comment.user_type && (
                <button
                  type="button"
                  className="cursor-pointer p-0"
                  aria-label="Edit comment"
                  onClick={() => {
                    handleEditComment(comment.id, comment.content);
                  }}
                >
                  <EditIcon sx={{ color: 'black', fontSize: 20 }} />
                </button>
              )}
            </div>
            {editCommentId === comment.id ? (
              <div className="mt-3 mr-10 flex flex-col">
                <textarea
                  ref={inputRef}
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  className="mt-1 min-h-[70px] resize-y rounded-md border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="comment-buttons mt-3 flex flex-grow items-center">
                  <button
                    className={`${buttonVariants.cancel}` + ' mr-4'}
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateComment(comment.id)}
                    className={`${buttonVariants.save}` + ' mr-4'}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, comment.id)}
                    className={`${buttonVariants.delete}` + ' mr-4'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1.5">{comment.content}</p>
            )}
          </div>
        </div>
      ))}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className="p-4 text-center">
          <p className="mb-2">Delete this comment?</p>
          <button
            type="button"
            className={`${buttonVariants.delete}` + ' mr-3'}
            onClick={handleDeleteComment}
          >
            Delete
          </button>
          <button
            type="button"
            className={buttonVariants.cancel}
            onClick={handleClosePopover}
          >
            Cancel
          </button>
        </div>
      </Popover>
      {comments.length > 0 && <Divider sx={{ mt: '10px' }} />}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleAddComment();
        }}
      >
        <textarea
          placeholder="Write a comment..."
          className="mt-5 mr-0 mb-3 ml-6 min-h-[80px] w-[90%] outline-0"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <div className="mr-9 flex justify-end">
          <button type="submit" className={buttonVariants.save}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(WorkoutCommentBox);
