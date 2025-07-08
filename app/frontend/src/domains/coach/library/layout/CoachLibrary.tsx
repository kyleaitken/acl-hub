import { useState } from "react";
import LibraryNavigation from "../components/LibraryNavigation";
import { LibraryTab } from "../types";
import ExercisesView from "../pages/ExercisesView";
import WarmupsView from "../pages/WarmupsView";
import CooldownsView from "../pages/CooldownsView";
import MetricsView from "../pages/MetricsView";

const CoachLibrary = () => {
    const [selectedTab, setSelectedTab] = useState(LibraryTab.Exercises);

    const renderContent = () => {
        switch (selectedTab) {
            case LibraryTab.Exercises:
                return <ExercisesView />
            case LibraryTab.Warmups:
                return <WarmupsView />
            case LibraryTab.Cooldowns:
                return <CooldownsView /> 
            case LibraryTab.Metrics:
                return <MetricsView /> 
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <LibraryNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
            <div className="flex-grow">
                {renderContent()}
            </div>
        </div>
    )
};

export default CoachLibrary;