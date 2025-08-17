import { NavLink } from "react-router-dom";

const tabs = [
  { id: 'exercises', name: 'Exercises', path: '/coach/library/exercises' },
  { id: 'warmups', name: 'Warmups', path: '/coach/library/warmups' },
  { id: 'cooldowns', name: 'Cooldowns', path: '/coach/library/cooldowns' },
  { id: 'metrics', name: 'Metric Sets', path: '/coach/library/metrics' },
];

const LibraryNavigation = () => {
  return (
    <div className="sticky top-0 max-h-screen flex flex-col items-start bg-white text-[var(--color-text)] min-w-[180px]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `${baseTabClasses} ${isActive ? activeTabExtra : ''}`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
};

export default LibraryNavigation;

const baseTabClasses =
  'no-underline text-[13px] px-4 py-3.5 hover:bg-gray-200 flex items-center gap-2 w-full cursor-pointer';

const activeTabExtra = 'bg-gray-200 border-r-5 border-r-blue-500';