import { Box, Button, Divider, IconButton, Input, OutlinedInput, Stack, styled, Tooltip, Typography } from "@mui/material";
import ProfilePictureBubble from "./ProfilePictureBubble";
import EditIcon from '@mui/icons-material/Edit';
import { WorkoutComment } from "../types/types";
import { formatDateToStringWithTime } from "../utils/dateUtils";

interface WorkoutCommentBoxProps {
    coachId: number;
    userId: number;
    role: string;
    coachFirstName: string;
    coachLastName: string;
    userFirstName: string;
    userLastName: string;
    workoutComments: WorkoutComment[];
    handleEditComment: (commentId: number, comment: string) => void;
}

const WorkoutCommentBox = (props: WorkoutCommentBoxProps) => {
    const { 
        coachId, userId, coachFirstName, coachLastName,
        userFirstName, userLastName, workoutComments, role,
        handleEditComment
    } = props;

    function getCommentUserId(comment_user_type: string) {
        return comment_user_type === "coach" ? coachId : userId;
    }

    function getCommentName(user_type: string): string {
        const firstName = user_type === "coach" ? coachFirstName : userFirstName;
        let lastName = user_type === "coach" ? coachLastName : userLastName;
        return `${firstName.replace(/^./, (char) => char.toUpperCase())} ${lastName.replace(/^./, (char) => char.toUpperCase())}`
    }

    function getCommentDateString(timestamp: Date): string {
        const date = new Date(timestamp)
        return formatDateToStringWithTime(date);
    }

    return (
        <Box sx={{mb: '20px'}}>
            {workoutComments.map((comment, index) => (
                <Box sx={{display: 'flex', ml: '20px', padding: '10px 0px'}} key={index}>
                    <Box sx={{mr: '20px'}}>
                        <ProfilePictureBubble userId={getCommentUserId(comment.user_type)} name={getCommentName(comment.user_type)} height={28}/>
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
        </Box>
    )
};

export default WorkoutCommentBox;

const CommentHeader = styled(Box)`
    display: flex;
    align-items: center;
`