import { useNavigate, useParams } from "react-router-dom";
import { useWarmupsActions } from "../hooks/useWarmupsActions";
import { toast } from 'react-hot-toast';
import WarmupCooldownForm, { WarmupCooldownFormValues } from "../components/WarmupCooldownForm";
import { useWarmupsData } from "../hooks/useWarmupsData";
import { useEffect } from "react";

const EditWarmup = () => {
    const navigate = useNavigate();
    const { updateWarmup, fetchWarmup } = useWarmupsActions();
    const { warmupId } = useParams();
    const id = Number(warmupId);

    const { warmups } = useWarmupsData();
    const warmup = warmups.find((e) => e.id === id);

    useEffect(() => {
        if (!warmup && id) {
          fetchWarmup(id).catch((e) => {
            console.error("Failed to fetch warmup:", e);
            toast.error("Could not load warmup");
          });
        }
    }, [warmup, id, fetchWarmup]);

    const handleUpdateWarmup = async (formData: WarmupCooldownFormValues) => {
        try {
            navigate('/coach/library/warmups'); 
            await updateWarmup({warmupId: id, ...formData});
            toast.success("Warmup saved!", { style: {backgroundColor: '#bffddc'}})
        } catch (e) {
            console.error('Failed to update warmup:', e);
            toast.error("Something went wrong when trying to update the warmup.")
        }
    };

    // TODO: Replace with skeleton component 
    if (!warmup) {
        return <p className="pl-15 py-10 pr-40">Loading warmup...</p>;
    }

    return (
      <>
        <WarmupCooldownForm
          formTitle={`Edit ${warmup.name}`}
          initialValues={{
            name: warmup.name,
            instructions: warmup.instructions,
            exerciseIds: warmup.exerciseIds ?? [],
            id: warmup.id
          }}
          onSubmit={handleUpdateWarmup}
          isEditing={true}
          submitLabel="Save Warmup"
        />
      </>
    )
};

export default EditWarmup;