import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import "./table.scss";
import editIcon from "../../assets/images/save-icon.svg";
import settingsIcon from "../../assets/images/settings.svg";
import plus from "../../assets/icons/plus.svg";
import reset from "../../assets/images/reset.svg";
import Reset from "../../assets/images/reset.svg";
import useDebounce from "../../common-methods/hooks/debounce";
import edit from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/delete.svg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import forward from "../../assets/images/forward.svg";
import backward from "../../assets/images/backward.svg";
import { getIcon } from "../../hooks/common-methods";
import Alerts from "../toast/toast";
import { Modal } from "../../components/modal/modal";
import refreshIcon from "../../assets/images/restart.svg";
import deletePopup from "../../assets/images/delete-icon.svg";

interface Alert {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}
interface TableComponentProps {
  columns: {
    sortable: boolean;
    key: any;
    label: string;
    field: string;
    clickable?: boolean;
    type?: string;
    list?: any[];
    eventKey?(item: any): any;
    filterType?: string;
    options?: { value: string; label: string }[];
    filterKey?: string;
    filterOptions?: { value: string | number; label: string }[];
    filterObjKey?: string;
    render?(item: any): React.ReactNode;
  }[];
  fetchData: (params: any) => Promise<any>;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => Promise<{ message: string }>;
  dataKey: string;
  textkey: string;
  heading?: string;
  currentTab?: string;
  navKey?: boolean;
  setupkey?: string;
  description?: string;
  buttonText?: string;
  subDescription?: string;
  setupDescripition?: string;
  createPermission: string;
  deletePermission: string;
  updatePermission: string;
  dashboardKey?: string;
  icon?: string;
  eventKey?(item: any): any;
  buttonKey?: boolean;
  actions?: boolean;
  daySearch?: boolean;
  clearButton?: boolean;
  filterRequiredKey?: boolean;
  showColumnSelector?: boolean;
  showResetButton?: boolean;
  showSearchInput?: boolean;
}

interface CustomDialogProps {
  message?: any;
  item?: any;
  col?: any;
}

export default function TableComponent({
  columns,
  currentTab,
  dashboardKey,
  fetchData,
  buttonKey,
  onEdit = undefined, // Default to undefined
  onDelete = undefined, // Default to undefined

  // onUndo,
  heading,
  dataKey,
  textkey,
  navKey,
  filterRequiredKey = false,
  deletePermission,
  updatePermission,
  icon,
  eventKey,
  actions = true,
  daySearch = false,
  showColumnSelector = true,
  showSearchInput = true,
  showResetButton = true,
}: // clearButton = false,
TableComponentProps) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<any>({});
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Reset error when filters or pagination changes
  useEffect(() => {
    setError(null);
  }, [currentPage, itemsPerPage, filters, sortBy, sortOrder]);
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const debounceFilters = useDebounce(filters, 2000);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actionType, setActionType] = useState<string>("");
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pagesToShow = 3;
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  const visiblePages = pageNumbers.slice(startPage - 1, endPage);
  const [searchValue, setSearchValue] = useState<string | string[]>("");

  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.key)
  );
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleConfirmation = useCallback((item: any, type: string) => {
    setSelectedItem(item);
    setActionType(type);
    setIsDialogOpen(true);
  }, []);

  const removeEmptyFields = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj
        .map(removeEmptyFields) // Recursively clean array items
        .filter(
          (item) =>
            item !== null &&
            item !== undefined &&
            item !== "" &&
            !(Array.isArray(item) && item.length === 0) &&
            !(typeof item === "object" && Object.keys(item).length === 0)
        );
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)

          .map(([key, value]) => [key, removeEmptyFields(value)]) // Recursively clean objects

          .filter(
            (
              entry // Use entry[1] instead of destructuring
            ) =>
              entry[1] !== null &&
              entry[1] !== undefined &&
              entry[1] !== "" &&
              !(Array.isArray(entry[1]) && entry[1].length === 0) &&
              !(
                typeof entry[1] === "object" &&
                Object.keys(entry[1]).length === 0
              )
          )
      );
    }

    return obj;
  };

  const fetchTableData = useCallback(async () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortBy,
      // sort_order: sortOrder,
      filters: { ...removeEmptyFields(filters) },
    };
    console.log('fetchTableData called with params:', params);
    setIsLoading(true);
    fetchData(params)
      .then((res) => {
        console.log('fetchData response:', res);
        console.log('res.data:', res.data);
        console.log('res.total:', res.total);
        setData(res.data || []);
        setTotalRecords(res.total);
        console.log('data state after setData:', res.data || []);
        console.log('totalRecords state after setTotalRecords:', res.total);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Error fetching data");
        setData([]);
        console.error("Error fetching data:", err);
      });
  }, [currentPage, sortBy, sortOrder, dataKey, itemsPerPage, debounceFilters]);

  useEffect(() => {
    console.log("sort", sortOrder);
    fetchTableData();
  }, [fetchTableData]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Debug effect to log data state
  useEffect(() => {
    console.log('Data state changed:', data, 'Data length:', data?.length);
  }, [data]);

  // Debug effect to log when rendering no records
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log('Rendering no records found. Data:', data, 'Data length:', data?.length);
    }
  }, [data]);

  const handleDelete = useCallback(
    (selectedItem: any) => {
      if (!onDelete) return;
      onDelete(selectedItem)
        .then((res) => {
          setAlerts([
            ...alerts,
            { type: "success", message: res.message, duration: 3000 },
          ]);
          fetchTableData();
        })

        .catch((err) => {
          setAlerts([
            ...alerts,
            {
              type: "error",
              message: err?.response?.data?.message || "Error deleting item!",
              duration: 3000,
            },
          ]);
        })
        .finally(() => {
          setIsDialogOpen(false);
          // setTimeout(() => setAlert({ ...alert, visible: false }), 5000)
        });
    },
    [onDelete, fetchTableData]
  );

  const confirmAction = useCallback(() => {
    if (actionType === "0" && onEdit && selectedItem) {
      onEdit(selectedItem);
      setIsDialogOpen(false);
      navigate(`/${textkey}/edit-${textkey}/${selectedItem.id}`);
    } else if (actionType === "1") {
      handleDelete(selectedItem);
    }
  }, [actionType, onEdit, selectedItem, handleDelete, navigate, textkey]);

  const handleActionSingle = () => {
    navigate(`/${textkey}s/add-${textkey}`);
  };

  // system admin action condition

  const handleActionMultiple = () => {
    navigate(`/${textkey}s/add-multiple-${textkey}s`);
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const convertObj = (arr: any, value: any) => {
    let res = {};
    const getObjValue = (item: any, i: any, res: any, parentKey: any) => {
      let r: any = {};
      if (arr.length - 1 === i) {
        r[item] = value;
      } else {
        r[item] = {};
      }
      for (let k in res) {
        if (k === parentKey) {
          res[k] = { ...r };
        }
      }
      if (!Object.keys(res).length) {
        res = { ...r };
      }
      return res;
    };
    arr.forEach((item: any, i: any) => {
      let parentKey = i > 0 ? arr[i - 1] : null;
      res = { ...getObjValue(item, i, res, parentKey) };
    });
    return res;
  };

  const handleSort = useCallback(
    (col: any) => {
      let value = sortOrder === "ASC" ? "DESC" : "ASC";
      let colArr = col.filterKey
        .replace(/[/\][\]']/g, ",")
        .split(",")
        .filter((i: any) => i);
      console.log(convertObj(colArr, value));
      // const order = sortBy === col.field && sortOrder === 'ASC' ? 'DESC' : 'ASC'
      const order = convertObj(colArr, value);
      setSortBy(order);
      setSortOrder(value);
    },

    [sortBy, sortOrder]
  );

  const handleCustomEvent = ({ event, item, col }: any) => {
    const dData = {
      message: `Are you sure you want to ${col.label}`,
      item,
      col,
    };
    setCustomDialogData({ ...dData });
    if (col.key === "status") {
      setIsDialogOpenCustom(true);
    } else {
      col?.eventKey({ event, item });
    }
  };

  const [isDialogOpenCustom, setIsDialogOpenCustom] = useState(false);
  const [customDialogData, setCustomDialogData] = useState<CustomDialogProps>(
    {}
  );
  const confirmActionCustom = () => {
    console.log("confirmActionCustom ", customDialogData);
    customDialogData.col.eventKey({
      event: customDialogData.col.event,
      item: customDialogData.item,
    });
    setIsDialogOpenCustom(false);
    fetchTableData();
  };

  const handleLimitChange = (value: string) => {
    setItemsPerPage(Number(value));
    setPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // const startIndex = (page - 1) * itemsPerPage;
      // const endIndex = Math.min(page * itemsPerPage, total);
      setPage(page);
    }
  };
  const getModalConfig = useCallback(
    () => ({
      type:
        actionType === "0"
          ? ("confirmation" as const)
          : actionType === "1"
          ? ("delete" as const)
          : actionType === "reset"
          ? ("reset" as const)
          : ("confirmation" as const),
      message:
        actionType === "reset"
          ? "Are your sure you want to change status to Active?"
          : `Are you sure you want to ${
              actionType === "0" ? "edit" : actionType === "1" ? "delete" : ""
            } this ${textkey}?`,
      onPrimaryClick: confirmAction,
      onSecondaryClick: () => setIsDialogOpen(false),
      icon:
        actionType === "0"
          ? editIcon
          : actionType === "1"
          ? deletePopup
          : actionType === "reset"
          ? Reset
          : editIcon,
      primaryButtonText:
        actionType === "0"
          ? "EDIT"
          : actionType === "1"
          ? "DELETE"
          : actionType === "reset"
          ? "RESET"
          : "CONFIRM",
      secondaryButtonText: "CANCEL",
    }),
    [actionType, textkey, confirmAction]
  );

  return (
    <>
      <div className="row1">
        {icon ? <img src={icon} className="user-icon" /> : ""}
        <div className="user-list-title">
          {currentTab && <h4 className="heading">{currentTab} List</h4>}
          {heading && <h4 className="heading">{heading} List</h4>}
        </div>
      </div>

      <div className="paginator-bg">
        {daySearch && (
          <div>
            <div className="day-search">
              <select
                onChange={(e) => {
                  console.log(e);
                  setFilters((prev) => ({
                    ...prev,
                    timeframe: e.target.value,
                  }));
                }}
                className="input-field"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yersterday</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="table-container">
        <div className={`table-wrapper ${isLoading ? "loading" : ""}`}>
          <div className="table-toolbar">
            <div className="search-buttons-container">
              {(searchValue ||
                filters ||
                selectedColumns.length < columns.length) && (
                <>
                  {showSearchInput && (
                    <input
                      className="input-small"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setFilters({ ...filters, search: e.target.value });
                      }}
                    />
                  )}
                  {showColumnSelector && (
                    <div
                      className="column-button"
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                    >
                      <button
                        className="table-buttons secondary"
                        onClick={() =>
                          setShowColumnDropdown(!showColumnDropdown)
                        }
                      >
                        <img src={settingsIcon} className="col-icon" />
                        Columns
                      </button>
                      {showColumnDropdown && (
                        <div className="column-dropdown" ref={dropdownRef}>
                          {columns.map((col) => (
                            <label key={col.key}>
                              <input
                                type="checkbox"
                                checked={selectedColumns.includes(col.key)}
                                onChange={() => toggleColumn(col.key)}
                              />
                              {col.label}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {showResetButton && (
                    <button
                      className="table-buttons secondary"
                      onClick={() => {
                        setSearchValue("");
                        setFilters({});
                        setPage(1);
                        setSelectedColumns(columns.map((col) => col.key));
                        fetchTableData();
                      }}
                    >
                      <img src={refreshIcon} className="col-icon" />
                      Reset
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="results-info">
              Showing{" "}
              <select
                value={itemsPerPage}
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                {[10, 25, 50, 100, 500].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>{" "}
              of {totalRecords} results
            </div>
          </div>

          <table className="custom-table">
            <thead className="table-headersss">
              <tr>
                {columns
                  .filter((col) => selectedColumns.includes(col.key))
                  .map((column) => (
                    <th
                      key={column.key}
                      className={column.field === "action" ? "td-action" : ""}
                    >
                      <div className="header-content">
                        <span className="column-label">{column.label}</span>
                        {column.sortable && (
                          <img
                            src={arrowDown}
                            className={`sort-icon ${
                              sortBy[column.key]
                                ? sortBy[column.key].toLowerCase()
                                : ""
                            }`}
                            alt="sort"
                            onClick={() =>
                              column.sortable && handleSort(column)
                            }
                          />
                        )}
                      </div>

                      {filterRequiredKey && column.filterType && (
                        <div className="filter-input">
                          {column.filterType === "string" ? (
                            <input
                              className="input-small"
                              type="text"
                              placeholder="Search..."
                              value={
                                typeof filters[column.filterKey ?? ""] ===
                                "string"
                                  ? filters[column.filterKey ?? ""]
                                  : ""
                              }
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  [column.filterKey ?? ""]: e.target.value,
                                }))
                              }
                            />
                          ) : column.filterType === "number" ? (
                            <input
                              placeholder="Search..."
                              type="number"
                              className="input-small"
                              value={filters[column.filterKey ?? ""] ?? ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value);
                                setFilters((prev: any) => ({
                                  ...prev,
                                  [column.filterKey ?? ""]: value,
                                }));
                              }}
                            />
                          ) : column.filterType === "date" ? (
                            <input
                              placeholder="Search..."
                              className="input-small"
                              type="date"
                              max={new Date().getFullYear() + 5}
                              min={2000}
                              onKeyDown={(e) => e.preventDefault()}
                              value={
                                typeof filters[column.filterKey ?? ""] ===
                                "string"
                                  ? filters[column.filterKey ?? ""]
                                  : ""
                              }
                              onChange={(e) => {
                                let selectedDate = e.target.value;
                                const selectedYear = new Date(
                                  selectedDate
                                ).getFullYear();
                                const maxYear = new Date().getFullYear() + 5;

                                if (selectedYear > maxYear) {
                                  selectedDate = "";
                                  setFilters((prev) => ({
                                    ...prev,
                                    [column.filterKey ?? ""]: "",
                                  }));
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    [column.filterKey ?? ""]: selectedDate,
                                  }));
                                }
                              }}
                            />
                          ) : column.filterType === "dropdown" ? (
                            <select
                              value={
                                typeof filters[column.filterKey ?? ""] ===
                                "string"
                                  ? filters[column.filterKey ?? ""]
                                  : ""
                              }
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  [column.filterKey ?? ""]: e.target.value,
                                }))
                              }
                              className="input-small"
                            >
                              <option value="">Select an option</option>
                              {column?.filterOptions?.map((option) => (
                                <option
                                  key={String(option.value)}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : column.filterType === "dropdown-object" ? (
                            <select
                              value={
                                typeof filters[column.filterKey ?? ""] ===
                                "object"
                                  ? filters[column.filterKey ?? ""]
                                  : ""
                              }
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  [column.filterKey ?? ""]: JSON.stringify([
                                    {
                                      [column.filterObjKey ?? ""]:
                                        e.target.value,
                                    },
                                  ]),
                                }))
                              }
                              className="custom-select"
                            >
                              <option value="">Select an option</option>
                              {column?.filterOptions?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={
                      columns.filter((col) => selectedColumns.includes(col.key))
                        .length
                    }
                    className="loading-message"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={
                      columns.filter((col) => selectedColumns.includes(col.key))
                        .length
                    }
                    className="error-message"
                  >
                    {error}
                  </td>
                </tr>
              ) : !data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.filter((col) => selectedColumns.includes(col.key))
                        .length
                    }
                    className="no-records-found"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  console.log('Rendering data item:', item, 'at index:', index);
                  return (
                    <tr key={index}>
                      {columns
                        .filter((col) => selectedColumns.includes(col.key))
                        .map((col) => {
                          if (
                            col.key === "action" &&
                            actions &&
                            !item.disableActions
                          ) {
                            if (col?.list?.length) {
                              return (
                                <td
                                  key={col.key}
                                  className={
                                    col.field === "action" ? "td-action" : ""
                                  }
                                >
                                  <div className="table-buttons-container">
                                    {col.list.map((btnlist: any, bi: number) => (
                                      <>
                                        {btnlist.btnType === "text" && (
                                          <button
                                            disabled={item.disableActions}
                                            key={bi}
                                            className={`${btnlist?.classes} text-icon`}
                                            onClick={(e) =>
                                              handleCustomEvent({
                                                event: e,
                                                item,
                                                col: btnlist,
                                              })
                                            }
                                          >
                                            {btnlist.icon && (
                                              <img src={btnlist.icon} />
                                            )}
                                            {btnlist.btnType === "text" && (
                                              <>{btnlist.label}</>
                                            )}
                                          </button>
                                        )}
                                        {btnlist.btnType === "icon" && (
                                          <>
                                            {btnlist.label === "edit" && (
                                              <button
                                                className="edit-btn"
                                                disabled={item.disableActions}
                                                onClick={() => {
                                                  setIsDialogOpen(true);
                                                  setSelectedItem(item);
                                                  setActionType("0");
                                                }}
                                              >
                                                <img
                                                  className="edit-icon"
                                                  src={edit}
                                                  alt="Edit"
                                                />
                                              </button>
                                            )}
                                            {btnlist.label === "delete" && (
                                              <button
                                                className="delete-btn"
                                                disabled={item.disableActions}
                                                onClick={() => {
                                                  setIsDialogOpen(true);
                                                  setSelectedItem(item);
                                                  setActionType("1");
                                                }}
                                              >
                                                <img
                                                  className="edit-icon"
                                                  src={deleteIcon}
                                                  alt="Delete"
                                                />
                                              </button>
                                            )}
                                            {btnlist.label !== "edit" &&
                                              btnlist.label !== "delete" && (
                                                <button
                                                  disabled={item.disableActions}
                                                  key={bi}
                                                  className={btnlist.classes}
                                                  onClick={(e) =>
                                                    handleCustomEvent({
                                                      event: e,
                                                      item,
                                                      col: btnlist,
                                                    })
                                                  }
                                                >
                                                  <img
                                                    className="action-btn"
                                                    src={getIcon(btnlist.icon)}
                                                    alt={btnlist.label}
                                                  />
                                                </button>
                                              )}
                                          </>
                                        )}
                                      </>
                                    ))}
                                  </div>
                                </td>
                              );
                            }
                          }

                          if (
                            col.field?.includes("status") &&
                            col?.type === "toggle"
                          ) {
                            return (
                              <td key={col.key}>
                                <div className="reset-status">
                                  <span
                                    className={`status with-dot ${String(
                                      item[col.key]
                                    ).toLowerCase()}`}
                                  >
                                    {item[col.key]}
                                  </span>
                                  <img
                                    src={reset}
                                    className="reset-icon"
                                    alt="reset"
                                    onClick={() =>
                                      handleConfirmation(item, "reset")
                                    }
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </td>
                            );
                          }

                          if (col?.clickable) {
                            return (
                              <td
                                key={col.key}
                                onClick={() =>
                                  eventKey ? eventKey({ col, item }) : null
                                }
                                style={{ fontWeight: "bold", cursor: "pointer" }}
                              >
                                {item[col.key]}
                              </td>
                            );
                          } else {
                            return <td key={col.key}>{item[col.key]}</td>;
                          }
                        })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="paginator">
          <div className="paginator-controls">
            <button
              className="btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <div className="previous">
                <img src={backward} alt="First Page" />
                <img src={backward} alt="First Page" />
              </div>
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`page-number ${
                  page === currentPage ? "active" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              className="btn-nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <div className="previous">
                <img src={forward} alt="Last Page" />
                <img src={forward} alt="Last Page" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <Alerts alerts={alerts} setAlerts={setAlerts} />
    </>
  );
}
