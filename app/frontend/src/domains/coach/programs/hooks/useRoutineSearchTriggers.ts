import { useEffect } from "react";
import { useCooldownsSearch } from "../../libraries/features/routines/hooks/useCooldownsSearch";
import { useWarmupsSearch } from "../../libraries/features/routines/hooks/useWarmupsSearch";

export function useRoutineSearchTriggers(warmupText: string, cooldownText: string) {
  const { searchWarmups, warmupSearchResults } = useWarmupsSearch();
  const { searchCooldowns, cooldownSearchResults } = useCooldownsSearch();

  useEffect(() => {
    if (warmupText.length < 3) return;
    const h = setTimeout(() => searchWarmups(warmupText), 250);
    return () => clearTimeout(h);
  }, [warmupText]);

  useEffect(() => {
    if (cooldownText.length < 3) return;
    const h = setTimeout(() => searchCooldowns(cooldownText), 250);
    return () => clearTimeout(h);
  }, [cooldownText]);

  return { warmupSearchResults, cooldownSearchResults };
}
