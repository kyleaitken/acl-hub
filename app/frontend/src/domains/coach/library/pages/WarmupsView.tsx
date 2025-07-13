import LibraryHeader from "../components/LibraryHeader";
import { useNavigate } from "react-router-dom";
import LibraryTable from "../components/LibraryTable";
import { useWarmupsData } from "../hooks/useWarmupsData";
import { useEffect, useMemo } from "react";
import { useWarmupsActions } from "../hooks/useWarmupsActions";

const WarmupsView = () => {
    const navigate = useNavigate();
    const { warmups } = useWarmupsData();
    const { fetchWarmups } = useWarmupsActions();

    useEffect(() => {
        fetchWarmups();
    }, [])

    const sortedWarmups = useMemo(() => {
        return warmups
            .slice()
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [warmups]);

    const handleWarmupClicked = (id: number) => {
        navigate(`/coach/library/warmups/${id}/edit`)    
    }

    return (
        <div className='flex flex-col pl-15 py-10 pr-40'>
            <LibraryHeader 
                title={"Warmups"}
                subtitle={"Use the warmup library to create commonly used warmup protocols."}
                buttonText={"Add Warmup"}
                addHandler={() => navigate('/coach/library/warmups/add')}
            />
            <LibraryTable 
                columns={[
                    { label: "Name", accessor: "name", width: "35%" },
                    { label: "Instructions", accessor: "instructions", width: "65%" }
                ]}
                data={sortedWarmups}
                handleItemClicked={handleWarmupClicked}
            />
        </div>
    )
};

export default WarmupsView;