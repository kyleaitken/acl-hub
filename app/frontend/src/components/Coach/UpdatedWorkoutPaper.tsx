import { Box, Button, Divider, Paper, Stack, styled, Typography } from "@mui/material";
import { UpdatedWorkout } from "../../types/types";
import ProfilePictureBubble from "../ProfilePictureBubble";
import { capitalize } from "../../utils/utils";
import { formatDateString } from "../../utils/dateUtils";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

interface UpdatedWorkoutProps {
    updatedWorkout: UpdatedWorkout
}

const UpdatedWorkoutPaper = ({ updatedWorkout }: UpdatedWorkoutProps) => {
    const formattedDate = formatDateString(updatedWorkout.workout.date)
    const [warmupExpanded, setWarmupExpanded] = useState(false);

    const getStatusColor = (completed: boolean) => {
        if (completed) return "green";
        return "red"; 
    };

    const getText = (completed: boolean, results?: string) => {
        if (results) return results; 
        if (completed) return "Completed"; 
        return "Not Completed"; 
    };

    return (
        <Paper sx={{width: '100%', mb: '50px'}}>
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