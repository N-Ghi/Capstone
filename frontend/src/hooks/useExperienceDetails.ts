import { useEffect, useState } from "react";
import { getExperienceById, getExperienceSlots, } from "../services/experienceService";

export const useExperienceDetails = (id?: string) => {
  const [experience, setExperience] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const exp = await getExperienceById(id);
        const slotData = await getExperienceSlots(id);

        setExperience(exp);
        setSlots(Array.isArray(slotData) ? slotData : slotData.results ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { experience, slots, setSlots, loading };
};