import { LibraryTab } from "../types";

interface LibraryNavigationProps {
    selectedTab: LibraryTab;
    setSelectedTab: (tab: LibraryTab) => void;
}

const LibraryNavigation = ({ selectedTab, setSelectedTab }: LibraryNavigationProps) => {

  const tabs = [
    { id: LibraryTab.Exercises, name: 'Exercises' },
    { id: LibraryTab.Warmups, name: 'Warmups' },
    { id: LibraryTab.Cooldowns, name: 'Cooldowns' },
    { id: LibraryTab.Metrics, name: 'Metric Sets' },
  ];

  return (
    <div className="library-navigation sticky top-0 max-h-screen flex flex-col items-start bg-white text-[var(--color-text)] w-[200px]">
        {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            const className = `${baseTabClasses} ${isActive ? activeTabExtra : ''}`;

            return (
                <div
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={className}
                >
                    {tab.name}
                </div>
            );
        })}
    </div>
  );
};

export default LibraryNavigation;

const baseTabClasses =
  'no-underline text-[15px] px-4 py-3.5 hover:underline flex items-center gap-2 w-full cursor-pointer';

const activeTabExtra = 'bg-gray-100 border-r-5 border-r-blue-500';