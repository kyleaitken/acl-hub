import LibraryHeader from "../../../components/LibraryHeader";
import LibraryTable from "../../../components/LibraryTable";
import { useNavigate } from "react-router-dom";
import { useCooldownsActions } from "../hooks/useCooldownsActions";
import { useCooldownsData } from "../hooks/useCooldownsData";
import { useEffect, useMemo } from "react";

const Cooldowns = () => {
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
        <div className='flex flex-col pl-25 py-10 pr-80'>
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

export default Cooldowns;