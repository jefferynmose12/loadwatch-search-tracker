import * as React from "react";
import { fetchCliSearches, fetchLoadsForSearch } from "../config";

export const useCliSearches = () => {
  const [items, setItems] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [datFilter, setDatFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("ACTIVE");
  const [truckerInput, setTruckerInput] = React.useState("");
  const [truckerFilter, setTruckerFilter] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loadsModalOpen, setLoadsModalOpen] = React.useState(false);
  const [selectedSearchId, setSelectedSearchId] = React.useState(null);
  const [loads, setLoads] = React.useState([]);
  const [loadsCount, setLoadsCount] = React.useState(0);
  const [loadsLoading, setLoadsLoading] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setTruckerFilter(truckerInput);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 400);
    return () => clearTimeout(id);
  }, [truckerInput]);

  const loadPage = React.useCallback(
    async (page) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCliSearches(
          page,
          pagination.page_size,
          datFilter,
          statusFilter,
          truckerFilter || null,
        );
        //console.log(data.data.items)
        setItems(data?.data?.items);
        setPagination({
          page: data.data.pagination.page,
          page_size: data.data.pagination.limit,
          total: data.data.pagination.total,
          total_pages: data.data.pagination.total_pages,
          has_next: data.data.pagination.has_next,
          has_prev: data.data.pagination.has_prev,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page_size, datFilter, statusFilter, truckerFilter],
  );

  const openLoads = async (searchId) => {
    setLoadsModalOpen(true);
    setSelectedSearchId(searchId);
    setLoads([]);
    setLoadsLoading(true);
    try {
      const data = await fetchLoadsForSearch(searchId);
      console.log("load", data);
      setLoads(data.data.loads);
      setLoadsCount(data.data.count);
    } finally {
      setLoadsLoading(false);
    }
  };

  const handleDatChange = (value) => {
    setDatFilter(value);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  React.useEffect(() => {
    loadPage(pagination.page);
  }, [loadPage, pagination.page]);


  const nextPage = () => {
    if (pagination.has_next) {
      void loadPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.has_prev) {
      void loadPage(pagination.page - 1);
    }
  };

  return {
    items,
    pagination,
    loading,
    error,
    nextPage,
    prevPage,
    loadPage,
    datFilter,
    statusFilter,
    handleDatChange,
    handleStatusChange,
    openLoads,
    loadsModalOpen,
    selectedSearchId,
    loads,
    loadsCount,
    loadsLoading,
    setLoadsModalOpen,
    truckerInput,
    setTruckerInput,
  };
};
