import { Box, Button, Divider, IconButton, Input, OutlinedInput, Popover, Stack, styled, Tooltip, Typography } from "@mui/material";
import ProfilePictureBubble from "./ProfilePictureBubble";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkoutComment } from "../types/types";
import { formatDateToStringWithTime } from "../utils/dateUtils";
import { useEffect, useRef, useState } from "react";

interface WorkoutCommentBoxProps {
    coachId: number;
    userId: number;
    role: string;
    coachFirstName: string;
    coachLastName: string;
    userFirstName: string;
    userLastName: string;
    workoutComments: WorkoutComment[];
    addComment: (comment: string) => void;
    deleteComment: (commentId: number) => void;
    updateComment: (commentId: number, newComment: string) => void;
}

const WorkoutCommentBox = (props: WorkoutCommentBoxProps) => {
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = useState<string>('');
    const [newComment, setNewComment] = useState<string>('');
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); 
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { 
        coachId, userId, coachFirstName, coachLastName,
        userFirstName, userLastName, workoutComments, role,
        addComment, deleteComment, updateComment
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

    const handleEditComment = (commentId: number, commentContent: string) => {
        setEditCommentId(commentId);
        setEditCommentContent(commentContent);
    };

    const handleCancelEdit = () => {
        setEditCommentId(null);
        setEditCommentContent('');
    };

    const handleAddComment = () => {
        addComment(newComment);
        setNewComment('');
    }

    const handleUpdateComment = async (commentId: number) => {
        if (!editCommentContent.trim()) return;

        await updateComment(commentId, editCommentContent);
        setEditCommentId(null)
    };

    const handleDeleteComment = async () => {
        if (commentToDelete) {
            setAnchorEl(null);
            await deleteComment(commentToDelete);
            setEditCommentId(null);
            setCommentToDelete(null);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
        setAnchorEl(event.currentTarget);
        setCommentToDelete(commentId);
    }

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCommentToDelete(null);
    }

    useEffect(() => {
        if (inputRef.current) {
            const length = editCommentContent.length;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(length, length);
        }
    }, [editCommentContent]);

    return (
        <Box sx={{mb: '20px'}}>
            {workoutComments.map((comment, index) => (
                <Box className="commentBox" sx={{display: 'flex', ml: '20px', padding: '10px 0px'}} key={index}>
                    <Box sx={{mr: '20px'}}>
                        <ProfilePictureBubble userId={getCommentUserId(comment.user_type)} name={getCommentName(comment.user_type)} height={28}/>
                    </Box>
                    <Stack className="commentStack" sx={{flexGrow: '1', mr: '20px'}}>
                        <CommentHeader>
                            <Typography className="commentUserName" sx={{fontWeight: '600', fontSize: '15px'}}>{getCommentName(comment.user_type) }</Typography>
                            <Typography className="commentDate" sx={{fontSize: '13px', ml: '10px', color: 'grey', flexGrow: 1}}>{getCommentDateString(comment.timestamp)}</Typography>
                            {role === comment.user_type && 
                                <IconButton sx={{padding: 0}} onClick={() => handleEditComment(comment.id, comment.content)}>
                                    <EditIcon sx={{color: 'black', fontSize: 20}}/>
                                </IconButton>
                            }
                        </CommentHeader>
                        {editCommentId === comment.id ? 
                        (
                            <Stack className="editCommentStack" sx={{mr: '30px', mt: '10px'}}>
                                <OutlinedInput
                                    inputRef={inputRef} 
                                    value={editCommentContent}
                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                    multiline
                                    sx={{ mt: '5px', fontSize: '14px', width: '100%', padding: '15px 15px', minHeight: '70px', alignItems: 'flex-start', 
                                    }}
                                >
                                </OutlinedInput>
                                <Box className="editCommentButtons" sx={{display: 'flex', alignItems: 'center', mt: '5px', flexGrow: 1}}>
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
                                        onClick={() => handleUpdateComment(comment.id)}
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
                                            onClick={(e) => handleDeleteClick(e, comment.id)}
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
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography sx={{ mb: 1 }}>Delete this comment?</Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteComment}
                        sx={{ mr: 1 }}
                    >
                        Delete
                    </Button>
                    <Button variant="outlined" onClick={handleClosePopover}>
                        Cancel
                    </Button>
                </Box>
            </Popover>
            {workoutComments.length > 0 && <Divider sx={{mt: '10px'}}/>}
            <form     
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment();
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
                            handleAddComment(); 
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