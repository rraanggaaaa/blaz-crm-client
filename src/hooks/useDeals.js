import { useState, useEffect, useCallback } from "react";
import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealsByStage,
} from "../services/api";

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [dealsByStage, setDealsByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const [dealsRes, stageRes] = await Promise.all([
        getDeals(),
        getDealsByStage(),
      ]);
      setDeals(dealsRes.data);
      setDealsByStage(stageRes.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDeal = useCallback(
    async (dealData) => {
      try {
        const response = await createDeal(dealData);
        setDeals((prev) => [response.data, ...prev]);
        await fetchDeals(); // Refresh pipeline
        return { success: true, data: response.data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchDeals],
  );

  const editDeal = useCallback(
    async (id, dealData) => {
      try {
        const response = await updateDeal(id, dealData);
        setDeals((prev) =>
          prev.map((deal) => (deal.id === id ? response.data : deal)),
        );
        await fetchDeals(); // Refresh pipeline
        return { success: true, data: response.data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchDeals],
  );

  const removeDeal = useCallback(
    async (id) => {
      try {
        await deleteDeal(id);
        setDeals((prev) => prev.filter((deal) => deal.id !== id));
        await fetchDeals(); // Refresh pipeline
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchDeals],
  );

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return {
    deals,
    dealsByStage,
    loading,
    error,
    fetchDeals,
    addDeal,
    editDeal,
    removeDeal,
  };
};
