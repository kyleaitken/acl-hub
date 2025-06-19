import { Skeleton, Paper, Stack, Box } from '@mui/material';

const UpdatedWorkoutSkeleton = () => {
  return (
    <Paper sx={{ width: '850px', mb: '50px', padding: '20px' }}>
      <Stack spacing={2}>
        {/* Header with avatar and name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton width="40%" height={24} />
            <Skeleton width="30%" height={20} />
          </Box>
        </Box>

        {/* Workout Title */}
        <Skeleton width="60%" height={32} />

        {/* Warmup Section */}
        <Skeleton width="40%" height={24} />
        <Skeleton width="90%" height={20} />
        <Skeleton width="85%" height={20} />

        {/* Exercise Blocks */}
        {[...Array(2)].map((_, i) => (
          <Box key={i} sx={{ ml: 2 }}>
            <Skeleton width="30%" height={24} />
            <Skeleton width="80%" height={20} />
            <Skeleton width="75%" height={20} />
          </Box>
        ))}

        {/* Comment Box */}
        <Skeleton variant="rectangular" width="100%" height={80} />
      </Stack>
    </Paper>
  );
};

export default UpdatedWorkoutSkeleton;
