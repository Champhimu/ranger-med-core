// src/hooks/useCapsules.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCapsulesThunk,
  fetchRecommendationsThunk,
  fetchCapsuleHistoryThunk
} from "../store/capsulesSlice";

export const useCapsules = () => {
  const dispatch = useDispatch();
  const { capsules, recommendations, loading, error } = useSelector((state) => state.capsules);

  useEffect(() => {
    dispatch(fetchCapsulesThunk());
    dispatch(fetchRecommendationsThunk());
  }, [dispatch]);

  const fetchHistory = (capsuleId) => dispatch(fetchCapsuleHistoryThunk(capsuleId));

  return { capsules, recommendations, loading, error, refetch: () => dispatch(fetchCapsulesThunk()), fetchHistory };
};
