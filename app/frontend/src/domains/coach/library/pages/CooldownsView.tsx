import LibraryHeader from "../components/LibraryHeader";
import { useNavigate } from "react-router-dom";
import LibraryTable from "../components/LibraryTable";
import { useCooldownsData } from "../hooks/useCooldownsData";
import { useEffect, useMemo } from "react";
import { useCooldownsActions } from "../hooks/useCooldownsActions";

const CooldownsView = () => {
    const navigate = useNavigate();
    const { cooldowns } = useCooldownsData();
    const { fetchCooldowns } = useCooldownsActions();

    useEffect(() => {
        fetchCooldowns();
    }, [])

    const sortedCooldowns = useMemo(() => {
        return cooldowns
            .slice()
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [cooldowns]);

    const handleCooldownClicked = (id: number) => {
        navigate(`/coach/library/cooldowns/${id}/edit`)    
    }

    return (
        <div className='flex flex-col pl-15 py-10 pr-40'>
            <LibraryHeader 
                title={"Cooldowns"}
                subtitle={"Use the cooldown library to create commonly used cooldown protocols."}
                buttonText={"Add Cooldown"}
                addHandler={() => navigate('/coach/library/cooldowns/add')}
            />
            <LibraryTable 
                columns={[
                    { label: "Name", accessor: "name", width: "35%" },
                    { label: "Instructions", accessor: "instructions", width: "65%" }
                ]}
                data={sortedCooldowns}
                handleItemClicked={handleCooldownClicked}
            />
        </div>
    )
};

export default CooldownsView;