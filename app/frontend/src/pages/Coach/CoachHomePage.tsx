import { Box, Divider, List, styled, Typography, Collapse, Button, ListItem, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getDaySuffix, getTimeOfDay } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ProfilePictureBubble from "../../components/ProfilePictureBubble";
import { fetchTodayWorkouts, fetchUpdatedWorkouts } from "../../slices/thunks/workoutThunks";
import { capitalize } from "../../utils/utils";
import UpdatedWorkoutPaper from "../../components/Coach/UpdatedWorkoutPaper";

const CoachHomePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const workoutsData = useSelector((state: RootState) => state.workouts);
    const coachName = useSelector((state: RootState) => state.auth.first_name);
    const todayWorkouts = workoutsData.todaysWorkouts;
    const updatedWorkouts = workoutsData.updatedWorkouts;
    const [collapseOpen, setCollapseOpen] = useState(false);

    console.log("Today workouts loaded from store: ", todayWorkouts); // needs to be re-fetched if new day
    console.log("Updated workouts loaded from store: ", updatedWorkouts);

    const currentDate = new Date()
    const dateString = currentDate.toISOString().split("T")[0];

    useEffect(() => {
        if (!todayWorkouts.length || todayWorkouts[0].workout_date !== dateString) {
            console.log("Refreshing today's workouts...");
            dispatch(fetchTodayWorkouts());
        }    
    }, [dateString])

    useEffect(() => {
        if (!updatedWorkouts.length) {
            console.log("Refreshing updated workouts...");
            dispatch(fetchUpdatedWorkouts());
        }    
    }, [])

    const timeOfDay = getTimeOfDay(currentDate);
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = currentDate.getDate();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const daySuffix = getDaySuffix(dayOfMonth)
    
    return (
        <CoachHomePageView id="coachHomePageBox">
            <LeftCoachDashboardBox>
                <Typography sx={{fontSize: '14px'}}>
                    {dayOfWeek}
                </Typography>
                <Typography sx={{fontSize: '24px', fontWeight: 'bold', lineHeight: 1.1, mb: '30px'}}>
                    {month} {dayOfMonth}{daySuffix}
                </Typography>
                <Divider />
                {/* Button to toggle collapse */}
                <Button onClick={() => setCollapseOpen((prev) => !prev)} sx={{ fontWeight: 'bold', textTransform: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                        {collapseOpen ? <ExpandMoreIcon sx={{pb: '1px', mr: '5px'}}/> : <ExpandLessIcon sx={{pb: '1px', mr: '5px'}}/>}
                        <Typography sx={{fontSize: '14px', fontWeight: '800', color: 'black'}}>
                            Today's Workouts
                        </Typography>
                    </Box>
                    <Box 
                        sx={{
                            padding: '1px 10px',
                            backgroundColor: (theme) => theme.palette.grey[300], 
                            borderRadius: '10px'
                        }}
                    >
                        <Typography sx={{fontSize: '13px'}}>
                            {todayWorkouts.length}
                        </Typography>
                    </Box>
                </Button>
                <Collapse in={collapseOpen}>
                        <List sx={{overflowY: 'auto', maxHeight: '80vh'}}>
                            {/* TODO: Make the today workout a link to the user workout and make this scrollable */}
                            {todayWorkouts.map((workoutItem, index) => (
                                <ListItem key={index} sx={{display: 'flex', alignItems: 'center'}}>
                                    <TodayWorkoutBox>
                                        <ProfilePictureBubble userId={workoutItem.user_id} name={`${workoutItem.first_name} ${workoutItem.last_name}`}/>
                                        <NamesBox>
                                            <Typography>{capitalize(workoutItem.first_name)} {capitalize(workoutItem.last_name)}</Typography>
                                            <Typography>{workoutItem.workout_name || 'Workout'}</Typography>
                                        </NamesBox>
                                    </TodayWorkoutBox>
                                </ListItem>
                            ))}
                        </List>
                </Collapse>
            </LeftCoachDashboardBox>
            <UpdatedWorkoutFeedBox id="updatedWorkoutsBox">
                <Stack sx={{padding: '25px 400px 40px 100px', overflowY: 'auto'}}>
                    <Typography sx={{mb: '40px', fontSize: '24px', fontWeight: '600'}}>Good {timeOfDay}, {coachName}!</Typography>
                    {updatedWorkouts.map((workout) => (
                        <UpdatedWorkoutPaper updatedWorkout={workout} />
                    ))}
                </Stack>
            </UpdatedWorkoutFeedBox>
        </CoachHomePageView>
    )

}

export default CoachHomePage;

const LeftCoachDashboardBox = styled(Box)({
    width: '300px',
    padding: '40px 30px',
    maxHeight: '100vh',
    position: 'sticky',
    top: 0
});

const NamesBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
`
const TodayWorkoutBox = styled(Box)`
    display: flex;
    align-items: center;
`

const UpdatedWorkoutFeedBox = styled(Box)(({ }) => ({
    background: '#F3F4F6',
    flexGrow: 1
}));

const CoachHomePageView = styled(Box)`
    display: flex;
    flex-grow: 1;
`