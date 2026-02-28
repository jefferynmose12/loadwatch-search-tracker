import { loadDetailHeaders, loadHeaders } from "../components/columns.jsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../components/ui/Table";
import { useCliSearches } from "../hook/useCliSearches.js";
import { getStatusClasses, utcIsoToEasternTime } from "../lib/index.js";

const Main = () => {
  const {
    items,
    pagination,
    loading,
    nextPage,
    prevPage,
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
  } = useCliSearches();

  return (
    <div className="relative space-y-4 p-5">
      <div className="flex flex-wrap gap-4 items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Trucker:</span>
          <input
            type="text"
            className="h-9 w-48 rounded border px-2 text-sm"
            placeholder="Search trucker..."
            value={truckerInput}
            onChange={(e) => setTruckerInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">DAT / Cinesis:</span>
          <select
            className="h-9 rounded border px-2 text-sm"
            value={datFilter}
            onChange={(e) => handleDatChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="dat">DAT</option>
            <option value="cinesis">Cinesis</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            className="h-9 rounded border px-2 text-sm"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border border-gray shadow-sm">
        <Table className="border">
          <TableHeader>
            <TableRow>
              {loadHeaders.map((col) => (
                <TableHead
                  key={col.key}
                  className="p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={loadHeaders.length}
                  className="p-4 text-center "
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item._id}
                  className="cursor-pointer bg-white hover:bg-gray-50"
                  onClick={() => openLoads(item.search_id)}
                >
                  {loadHeaders.map((col) => {
                    const value = item[col.key];

                    if (col.key === "status") {
                      return (
                        <TableCell key={col.key} className="p-3">
                          <span
                            className={[
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                              getStatusClasses(value),
                            ].join(" ")}
                          >
                            {value}
                          </span>
                        </TableCell>
                      );
                    }

                    if (col.key === "use_dat") {
                      const isDat = Boolean(value);
                      return (
                        <TableCell key={col.key} className="p-3">
                          <span
                            className={[
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                              isDat
                                ? "bg-sky-100 text-sky-800 border-sky-200"
                                : "bg-violet-100 text-violet-800 border-violet-200",
                            ].join(" ")}
                          >
                            {isDat ? "DAT" : "CINESIS"}
                          </span>
                        </TableCell>
                      );
                    }

                    if (col.key === "watch_seconds") {
                      const seconds = Number(value) || 0;
                      const minutes = Math.floor(seconds / 60);

                      return (
                        <TableCell key={col.key} className="p-3">
                          <span className="text-sm whitespace-nowrap">
                            {minutes} min
                          </span>
                        </TableCell>
                      );
                    }

                    if (col.key === "start_pst") {
                      const start = utcIsoToEasternTime(item.created_at);
                      return (
                        <TableCell
                          key={col.key}
                          className="p-3 text-sm whitespace-nowrap"
                        >
                          {start}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={col.key}
                        className="p-3 text-sm whitespace-nowrap"
                      >
                        {Array.isArray(value)
                          ? value.length > 0
                            ? value.join(", ")
                            : "-"
                          : value === null ||
                              value === undefined ||
                              value === ""
                            ? "-"
                            : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-3 flex items-center justify-between text-sm">
          <span>
            Page {pagination.page} of {pagination.total_pages} •{" "}
            {pagination.total} searches
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={!pagination.has_prev || loading}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={nextPage}
              disabled={!pagination.has_next || loading}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {loadsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600">
          <div className="w-full max-w-7xl rounded-lg bg-background p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between text-white">
              <div>
                <h2 className="text-base font-semibold">
                  Loads for search {selectedSearchId}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {loadsCount} loads found
                </p>
              </div>
              <button
                onClick={() => setLoadsModalOpen(false)}
                className="h-8 rounded border px-3 text-xs text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    {loadDetailHeaders.map((col) => (
                      <TableHead
                        key={col.key}
                        className="p-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadsLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={loadDetailHeaders.length}
                        className="p-4"
                      >
                        Loading loads...
                      </TableCell>
                    </TableRow>
                  ) : (
                    loads.map((load) => (
                      <TableRow key={load._id}>
                        {loadDetailHeaders.map((col) => {
                          let value = load[col.key];

                          if (col.key === "rate_per_mile_est") {
                            value =
                              typeof value === "number"
                                ? value.toFixed(2)
                                : (value ?? "-");
                          }

                          if (col.key === "payment") {
                            value =
                              typeof value === "number"
                                ? value.toLocaleString()
                                : (value ?? "-");
                          }

                          if (col.key === "origin_city") {
                            value = `${load.origin_city ?? "-"}, ${load.origin_state ?? "-"}`;
                          }
                          if (col.key === "destination_city") {
                            value = `${load.destination_city ?? "-"}, ${
                              load.destination_state ?? "-"
                            }`;
                          }

                          return (
                            <TableCell
                              key={col.key}
                              className="p-2 text-xs whitespace-nowrap"
                            >
                              {value === null ||
                              value === undefined ||
                              value === "" ||
                              (Array.isArray(value) && value.length === 0)
                                ? "-"
                                : String(value)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
