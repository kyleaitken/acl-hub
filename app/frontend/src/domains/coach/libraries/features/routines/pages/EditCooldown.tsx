import { useNavigate, useParams } from "react-router-dom";
import { useCooldownsActions } from "../hooks/useCooldownsActions";
import { toast } from 'react-hot-toast';
import WarmupCooldownForm, { WarmupCooldownFormValues } from "../components/WarmupCooldownForm";
import { useEffect } from "react";
import { useCooldownsData } from "../hooks/useCooldownsData";

const EditCooldown = () => {
    const navigate = useNavigate();
    const { updateCooldown, fetchCooldown } = useCooldownsActions();
    const { cooldownId } = useParams();
    const id = Number(cooldownId);

    const { cooldowns } = useCooldownsData();
    const cooldown = cooldowns.find((c) => c.id === id);

    useEffect(() => {
        if (!cooldown && id) {
          fetchCooldown(id).catch((e) => {
            console.error("Failed to fetch cooldown:", e);
            toast.error("Could not load cooldown");
          });
        }
    }, [cooldown, id, fetchCooldown]);

    const handleUpdateCooldown = async (formData: WarmupCooldownFormValues) => {
        try {
            navigate('/coach/library/cooldowns'); 
            await updateCooldown({id: id, ...formData});
            toast.success("Cooldown saved!", { style: {backgroundColor: '#bffddc'}})
        } catch (e) {
            console.error('Failed to update cooldown:', e);
            toast.error("Something went wrong when trying to update the cooldown.")
        }
    };

    // TODO: Replace with skeleton component 
    if (!cooldown) {
        return <p className="pl-15 py-10 pr-40">Loading cooldown...</p>;
    }

    return (
      <>
        <WarmupCooldownForm
          formTitle={`Edit ${cooldown.name}`}
          formType="Cooldown"
          initialValues={{
            name: cooldown.name,
            instructions: cooldown.instructions,
            exerciseIds: cooldown.exerciseIds ?? [],
            id: cooldown.id
          }}
          onSubmit={handleUpdateCooldown}
          isEditing={true}
          submitLabel="Save Cooldown"
        />
      </>
    )
};

export default EditCooldown;