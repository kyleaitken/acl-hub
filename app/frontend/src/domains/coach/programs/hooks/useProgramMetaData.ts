import { useProgramStore } from "../store/programStore";

export const useProgramMetaData = (programId: number) => {
  const name        = useProgramStore(
    (s) => s.detailedPrograms[programId]?.name
  );
  const description = useProgramStore(
    (s) => s.detailedPrograms[programId]?.description
  );
  const numWeeks    = useProgramStore(
    (s) => s.detailedPrograms[programId]?.num_weeks ?? 0
  );

  return { name, description, numWeeks };
}