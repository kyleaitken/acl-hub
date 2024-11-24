import { Box, Button, Divider, IconButton, Input, OutlinedInput, Paper, Stack, styled, Tooltip, Typography } from "@mui/material";
import { UpdatedWorkout } from "../../types/types";
import { AppDispatch, RootState } from '../../store'; // Adjust the path to your store
import ProfilePictureBubble from "../ProfilePictureBubble";
import { capitalize } from "../../utils/utils";
import { formatDateString, formatDateToStringWithTime } from "../../utils/dateUtils";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommentToWorkout, deleteWorkoutComment, updateWorkoutComment } from "../../slices/thunks/workoutThunks";

interface UpdatedWorkoutProps {
    updatedWorkout: UpdatedWorkout
}

const UpdatedWorkoutPaper = ({ updatedWorkout }: UpdatedWorkoutProps) => {
    const formattedDate = formatDateString(updatedWorkout.workout.date)
    const [warmupExpanded, setWarmupExpanded] = useState(false);
    const [newComment, setNewComment] = useState<string>('');
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = useState<string>('');
    const { first_name, last_name, id, token, role } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const inputRef = useRef<HTMLInputElement>(null);

    const userId = updatedWorkout.user_id;
    const workoutId = updatedWorkout.workout.id;
    const programId = updatedWorkout.workout.programId;

    const getStatusColor = (completed: boolean) => {
        if (completed) return "green";
        return "red"; 
    };

    const getText = (completed: boolean, results?: string) => {
        if (results) return results; 
        if (completed) return "Completed"; 
        return "Not Completed"; 
    };

    function getCommentId(user_type: string) {
        if (user_type === "coach" && id) {
            return id;
        }
        return updatedWorkout.user_id;
    }

    function getCommentName(user_type: string): string {
        if (user_type === "coach") {
            return `${first_name} ${last_name}`;
        } 
        const userFirstName = updatedWorkout.first_name.replace(/^./, (char) => char.toUpperCase());
        const userLastName = updatedWorkout.last_name.replace(/^./, (char) => char.toUpperCase());
        return `${userFirstName} ${userLastName}`
    }

    function getCommentDateString(timestamp: Date): string {
        const date = new Date(timestamp)
        return formatDateToStringWithTime(date);
    }

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        if (token) {
            dispatch(
                addCommentToWorkout({
                    token,
                    userId,
                    programId,
                    workoutId,
                    comment: newComment.trim(),
                })
            );
        }
    
        setNewComment('');
    };

    const handleEditComment = (commentId: number, commentContent: string) => {
        setEditCommentId(commentId);
        setEditCommentContent(commentContent);
    };

    const handleSaveComment = async (commentId: number) => {
        if (!editCommentContent.trim()) return;
        console.log("in save comment")

        if (token) {
            try {
                await dispatch(updateWorkoutComment({ 
                    token, 
                    commentId,
                    userId,
                    programId, 
                    workoutId, 
                    comment: editCommentContent.trim() 
                }));
                setEditCommentId(null); 
            } catch (error) {
                console.error('Failed to update comment:', error);
            }
        }   
    };

    const handleDeleteComment = async (commentId: number) => {
        console.log("in delete comment")

        if (token) {
            try {
                await dispatch(deleteWorkoutComment({ 
                    token, 
                    commentId,
                    userId,
                    programId, 
                    workoutId, 
                }));
                setEditCommentId(null); 
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        }   
    };

    const handleCancelEdit = () => {
        setEditCommentId(null);
        setEditCommentContent('');
    };

    useEffect(() => {
        if (inputRef.current) {
            const length = editCommentContent.length;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(length, length);
        }
    }, [editCommentContent]);

    return (
        <Paper sx={{width: '850px', mb: '50px'}}>
            <Stack>
                <HeaderBox>
                    {/* TODO: Make profile pictre/name clickable link to user page*/}
                    <ProfilePictureBubble height={50} userId={updatedWorkout.user_id} name={`${updatedWorkout.first_name} ${updatedWorkout.last_name}`}/> 
                    <Stack sx={{ml: '20px'}}>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            {capitalize(updatedWorkout.first_name)} {capitalize(updatedWorkout.last_name)}
                        </Typography>
                        <Typography sx={{fontSize: '14px'}}>Due {formattedDate}</Typography>
                    </Stack>
                </HeaderBox>
                <Divider />
                <Typography sx={{margin: '20px 0px 20px 20px', fontSize: '20px', fontWeight: '600'}}>{updatedWorkout.workout.name || "Workout"}</Typography>
                <Divider sx={{margin: '0px 20px'}}/> 
                {!updatedWorkout.workout.warmup &&
                    <WarmupWrapper>
                        <WarmupBox>
                            <LocalFireDepartmentIcon sx={{fontSize: '20px'}}/>
                            <Button 
                                sx={{
                                    ml: '10px',
                                    '&:hover': {
                                        backgroundColor: 'transparent'
                                    }
                                }} 
                                onClick={() => setWarmupExpanded((prev) => !prev)} 
                                disableRipple
                            >
                                {warmupExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                                <Typography sx={{color: 'black', fontSize: '15px', fontWeight: '600', textTransform: 'none'}}>
                                    Warmup
                                </Typography>
                            </Button>
                        </WarmupBox>
                        {warmupExpanded && (
                            <Typography sx={{ml: '50px', mt: '15px', fontSize: '14px', whiteSpace: 'pre-line'}}>
                                {updatedWorkout.workout.warmup || "Squats x 10\n Push up x 10"}
                            </Typography>
                        )}
                        <Divider sx={{margin: '20px 20px'}}/>
                    </WarmupWrapper>
                }
                {updatedWorkout.workout.exercises.map((exercise, index) => (
                    <ExerciseBox key={index}>
                        <ExerciseHeaderBox className="exerciseHeaderBox">
                            <ExerciseOrder className="exerciseOrderBox">
                                <Typography sx={{textAlign: 'center'}}>{exercise.order}</Typography>
                            </ExerciseOrder>
                            <Typography sx={{fontSize: '18px', fontWeight: '600', ml: '10px', flexGrow: '1'}}>{exercise.name}</Typography>
                            {exercise.completed ? <CheckIcon sx={{color: 'green', mr: '20px'}}/> : <CloseIcon sx={{color: 'red', mr: '20px'}}/>}
                        </ExerciseHeaderBox>
                        <Typography sx={{ml: '50px', mb: '10px', fontSize: '14px', whiteSpace: 'pre-line'}}>
                            {exercise.instructions || "3 Sets x 10 Reps\nSlow and controlled"}
                        </Typography>
                        <ResultsPaper statusColor={getStatusColor(exercise.completed)}>
                            <Typography sx={{whiteSpace: 'pre-line'}}>{getText(exercise.completed, exercise.results)}</Typography>
                        </ResultsPaper>
                    </ExerciseBox>
                ))}
                <Divider sx={{mb: updatedWorkout.workout.comments.length > 0 ? '10px' : '0px'}}/>
                <CommentSection sx={{mb: '20px'}}>
                    {updatedWorkout.workout.comments && updatedWorkout.workout.comments.map((comment, index) => (
                        <Box sx={{display: 'flex', ml: '20px', padding: '10px 0px'}} key={index}>
                            <Box sx={{mr: '20px'}}>
                                <ProfilePictureBubble userId={getCommentId(comment.user_type)} name={getCommentName(comment.user_type)} height={28}/>
                            </Box>
                            <Stack sx={{flexGrow: '1', mr: '20px'}}>
                                <CommentHeader>
                                    <Typography sx={{fontWeight: '600', fontSize: '15px'}}>{getCommentName(comment.user_type) }</Typography>
                                    <Typography sx={{fontSize: '13px', ml: '10px', color: 'grey', flexGrow: 1}}>{getCommentDateString(comment.timestamp)}</Typography>
                                    {role === comment.user_type && 
                                        <IconButton sx={{padding: 0}} onClick={() => handleEditComment(comment.id, comment.content)}>
                                            <EditIcon sx={{color: 'black', fontSize: 20}}/>
                                        </IconButton>
                                    }
                                </CommentHeader>
                                {editCommentId === comment.id 
                                ? 
                                (
                                <Stack sx={{mr: '30px', mt: '10px'}}>
                                    <OutlinedInput
                                        inputRef={inputRef} 
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        multiline
                                        sx={{ mt: '5px', fontSize: '14px', width: '100%', padding: '15px 15px', minHeight: '70px', alignItems: 'flex-start', 
                                         }}
                                    >
                                    </OutlinedInput>
                                    <Box sx={{display: 'flex', alignItems: 'center', mt: '5px', flexGrow: 1}}>
                                         <Button
                                            onClick={handleCancelEdit} 
                                            sx={{
                                                fontSize: '13px',
                                                mr: '10px',
                                                padding: '4px 0px',
                                                '&:hover': {
                                                    background: 'lightgrey'
                                                }
                                            }}
                                         >
                                            Cancel
                                         </Button>
                                         <Button
                                            onClick={() => handleSaveComment(comment.id)}
                                            sx={{
                                                background: '#4e4eff', 
                                                color: 'white',
                                                mr: '10px',
                                                fontSize: '13px',
                                                padding: '4px 0px',
                                                '&:hover': {
                                                    backgroundColor: 'blue'
                                                }
                                            }}
                                         >
                                            Save
                                         </Button>
                                         <Tooltip title="Delete comment" placement="top"
                                            componentsProps={{
                                                tooltip: {
                                                sx: {
                                                    backgroundColor: '#FF4D4D', 
                                                    color: 'white', 
                                                    fontSize: '14px', 
                                                    boxShadow: 2, 
                                                },
                                                },
                                            }}
                                         >
                                            <IconButton
                                                onClick={() => handleDeleteComment(comment.id)}
                                                sx={{
                                                    '&:hover': {
                                                        background: 'transparent'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon sx={{color: 'red'}}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Stack>
                                )
                                : (<Typography sx={{mt: '5px', fontSize: '14px'}}>{comment.content}</Typography>)}
                            </Stack>
                        </Box>
                    ))}
                    {updatedWorkout.workout.comments.length > 0 && <Divider sx={{mt: '10px'}}/>}
                    <form     
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitComment();
                        }}
                    >
                        <Input 
                            placeholder="Write a comment..." 
                            disableUnderline 
                            multiline
                            sx={{
                                margin: '20px 0px 20px 20px',
                                width: '90%',
                                minHeight: '80px',
                                alignItems: 'flex-start', 
                                lineHeight: '1.5' 
                            }}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitComment(); 
                                }
                            }}
                        />
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mr: '20px'}}>
                            <Button type="submit" variant="contained" 
                                sx={{
                                    backgroundColor: '#4e4eff',
                                    color: 'white',
                                    fontSize: '13px',
                                    padding: '4px 0px',
                                    '&:hover':{
                                        backgroundColor: 'blue'
                                    }
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </form>
                </CommentSection>
            </Stack>
        </Paper>
    )
};

export default UpdatedWorkoutPaper;

const HeaderBox = styled(Box)`
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin: 20px 0px 20px 20px;
`

const WarmupBox = styled(Box)`
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 20px;
`
const WarmupWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`

const ExerciseHeaderBox = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`

const ExerciseOrder = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px'
}));

const ExerciseBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`

const ResultsPaper = styled(Paper)(({ statusColor }: { statusColor: string }) => ({
    backgroundColor: statusColor === "green" ? "#E5FFF6" : "#ffdde6",
    borderLeft: `4px solid ${statusColor}`,
    borderRadius: '2px',
    marginBottom: "30px",
    marginLeft: "50px",
    marginRight: "50px",
    padding: "15px 15px",
}));

const CommentSection = styled(Box)`
`

const CommentHeader = styled(Box)`
    display: flex;
    align-items: center;
`

