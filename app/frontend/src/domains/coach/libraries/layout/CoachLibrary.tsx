import LibraryNavigation from "../components/LibraryNavigation";
import { Outlet } from "react-router-dom";

const CoachLibrary = () => {

    return (
        <div className="flex min-h-screen bg-gray-100">
            <LibraryNavigation />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    )
};

export default CoachLibrary;