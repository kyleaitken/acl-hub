import { Box, ListItem, Skeleton } from '@mui/material';
import { styled } from '@mui/system';

const TodayWorkoutBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const NamesBox = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const TodayWorkoutSkeleton = () => {
  return (
    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
      <TodayWorkoutBox>
        <Skeleton variant="circular" width={40} height={40} />
        <NamesBox>
          <Skeleton width={100} height={20} />
          <Skeleton width={120} height={20} />
        </NamesBox>
      </TodayWorkoutBox>
    </ListItem>
  );
};

export default TodayWorkoutSkeleton;
