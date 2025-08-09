import ProfilePictureBubble from '../../../shared/components/ProfilePictureBubble';
import { capitalize } from '../../core/utils/text';

// WorkoutHeader.tsx
interface WorkoutHeaderProps {
  clientId: number;
  firstName: string;
  lastName: string;
  dueDate: string;
}

const WorkoutHeader = ({
  clientId,
  firstName,
  lastName,
  dueDate,
}: WorkoutHeaderProps) => (
  <div className="m-5 mb-2 flex w-full items-center">
    {/* TODO: ADD LINK TO CLIENT PAGE */}
    <ProfilePictureBubble
      userType="client"
      height={50}
      userId={clientId}
      name={`${firstName} ${lastName}`}
    />
    <div className="ml-5">
      <p className="text-lg font-bold">
        {capitalize(firstName)} {capitalize(lastName)}
      </p>
      <p>Due {dueDate}</p>
    </div>
  </div>
);

export default WorkoutHeader;
