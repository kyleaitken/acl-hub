import { RootState } from "../store";
import { useSelector } from "react-redux";
import { selectUserProfilePicture } from "../slices/selectors/usersSelectors";
import { Avatar } from "@mui/material";

interface ProfilePictureBubbleProps {
    userId: number;
    name: string;
    height?: number;
}

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}
  
function stringAvatar(name: string, height: number) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: height,
        height: height
      },
      children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`,
    };
}

const ProfilePictureBubble = (props: ProfilePictureBubbleProps) => {
    const { userId, name, height = 34 } = props;
    const profilePictureUrl = useSelector((state: RootState) => selectUserProfilePicture(userId)(state));

    return (
        <Avatar
            src={profilePictureUrl || undefined}
            {...(!profilePictureUrl ? stringAvatar(name, height) : {})}
        />
    )
};

export default ProfilePictureBubble;