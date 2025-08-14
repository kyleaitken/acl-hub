import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WestIcon from "@mui/icons-material/West";
import { useNavigate, useParams } from "react-router-dom";
import { useProgramData } from "../hooks/useProgramStoreData";
import ProgramSkeleton from "../components/ProgramSkeleton";
import ProgramWeek from "../components/ProgramWeek";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SelectedWorkoutsFooter from "../components/SeletedWorkoutsFooter";
import { useProgramPageActions } from "../hooks/useProgramPageActions";
import { useProgramMetaData } from "../hooks/useProgramMetaData";

const ProgramPage = () => {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);
  const { selectedWorkoutIds } = useProgramData();

  const {
    workoutsByWeek,
    moveWorkout, handleDrop, onDayHover,
    deleteSelected, copyLastWeek, addWeek,
    handleSelectAll, handleShiftSelect, deleteWeek
  } = useProgramPageActions(id);

  const { name, description, numWeeks } = useProgramMetaData(id);

  if (name === undefined) return <ProgramSkeleton />;

  return (
    <>
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 pb-0 bg-gray-100 h-screen overflow-y-auto">
        <button
          className="cursor-pointer hover:underline text-blue-600"
          onClick={() => navigate("/coach/programs")}
        >
          <WestIcon sx={{ fontSize: "18px", mr: 1.5 }} />
          <span className="text-md">Back to Programs</span>
        </button>
        <div
          id="program-box"
          className="flex flex-col w-full bg-white mt-10 py-10 px-8 rounded-md"
        >
          <div className="flex" id="program-header">
            <div id="program-title-and-description" className="flex flex-col flex-grow">
              <div className='text-3xl font-bold'>{name}</div>
              <div className='mt-4 text-md'>{description}</div>
            </div>
            <div id="top-program-buttons" className='flex flex-col'>
              <button className='border-1 py-1 px-8 h-[40px] rounded-md cursor-pointer flex items-center mb-2 hover:bg-gray-200'>
                <EditIcon sx={{fontSize: '18px', mr: 1}} />
                Edit Program
              </button>
              <button className='border-1 py-1 px-8 h-[40px] rounded-md cursor-pointer flex items-center bg-[#356ccc] text-white hover:bg-blue-500'>
                <SendIcon sx={{ fontSize: '18px', mr: 1 }} />
                Assign to Client
              </button>
            </div>
          </div>
          <hr className="w-full border-t border-gray-400 my-4" />
          <p className="font-semibold text-xl mb-2">Workouts</p>
          {[...Array(numWeeks)].map((_, i) => {
            const weekNum = i + 1;
            const workouts = workoutsByWeek[weekNum] || [];
            return (
              <ProgramWeek
                programId={id}
                key={weekNum}
                week={weekNum}
                workouts={workouts}
                isLastWeek={weekNum === numWeeks}
                moveWorkout={moveWorkout}
                onDrop={handleDrop}
                onDayHover={onDayHover}
                onSelectWorkout={handleShiftSelect}
                deleteWeek={deleteWeek}
              />
            );
          })}

          {selectedWorkoutIds.length > 0 &&
            <SelectedWorkoutsFooter 
              selectedWorkoutIds={selectedWorkoutIds}
              handleDeleteWorkoutsClicked={deleteSelected}
              handleSelectAllClicked={handleSelectAll}
            />
          }

          <div className="mt-10 ml-3 flex">
            <button
              onClick={copyLastWeek}
              className="border-1 rounded-md py-2 px-5 flex items-center cursor-pointer hover:bg-gray-100 mr-5"
            >
              <ContentCopyIcon />
              <span className="px-2">Copy Previous Week</span>
            </button>
            <button
              onClick={addWeek}
              className="border-1 rounded-md py-2 px-5 flex items-center cursor-pointer hover:bg-gray-100"
            >
              <AddIcon />
              <span className="px-2">Add Empty Week</span>
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
    </>
  );
};

export default ProgramPage;
