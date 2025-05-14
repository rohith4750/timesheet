import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { permissionAccess } from "../../hooks/permissionAccess";
import useDebounce from "../../hooks/debounce";
import {
  selectSetupData,
  selectSetupStatus,
} from "../../store/reducers/dashboard";
import editIcon from "src/assets/images/save-icon.svg";
import deleteIcon from "src/assets/images/delete-icon.svg";
import settingsIcon from "src/assets/images/settings.svg";
import plus from "src/assets/icons/plus.svg";
import refreshIcon from "src/assets/images/restart.svg";
import deletePopup from "src/assets/images/delete-popup.svg";
import "./common-table.scss";

const getActiveClass = (type: string): string => {
  return `action-btn ${type.toLowerCase()}-btn`;
};

interface TableComponentProps {
  columns: {
    sortable: boolean;
    key: any;
    label: string;
    field: string;
    clickable?: boolean;
    filterKey?: string;
  }[];
  fetchData: (params: any) => Promise<any>;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => Promise<{ message: string }>;
  onSystemAdminAction?(item: any): any;
  dataKey: string;
  textkey: string;
  heading?: string;
  currentTab?: string;
  navKey?: boolean;
  setupkey?: string;
  buttonText?: string;
  subDescription?: string;
  setupDescripition?: string;
  createPermission: string;
  deletePermission: string;
  updatePermission: string;
  icon?: string;
  buttonKey?: boolean;
  actions?: boolean;
  showColumnSelector?: boolean;
  showResetButton?: boolean;
  showSearchInput?: boolean;
}

export default function TableComponent({
  columns,
  currentTab,
  fetchData,
  buttonKey,
  onEdit = undefined,
  onDelete = undefined,
  heading,
  textkey,
  navKey,
  buttonText,
  setupkey,
  subDescription,
  setupDescripition,
  createPermission,
  deletePermission,
  updatePermission,
  icon,
  onSystemAdminAction,
  actions = true,
  showColumnSelector = true,
  showSearchInput = true,
  showResetButton = true,
}: TableComponentProps) {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<any>({});
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const debounceFilters = useDebounce(filters, 2000);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const setupStatus = useSelector(selectSetupStatus);
  const setupData = useSelector(selectSetupData);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.key)
  );
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    {
      label: "Add Clinics",
      status:
        setupData.clinicCount > 0
          ? "completed"
          : setupStatus === false && setupData.clinicCount === 0
          ? "in-progress"
          : "not-completed",
    },
    {
      label: "Add Labs",
      status:
        setupData.labCount > 0
          ? "completed"
          : setupStatus === false && setupData.labCount === 0
          ? "in-progress"
          : "not-completed",
    },
    {
      label: "Add Users",
      status:
        setupData.userCount > 0
          ? "completed"
          : setupStatus === false && setupData.userCount === 0
          ? "in-progress"
          : "not-completed",
    },
  ];

  const fetchTableData = useCallback(async () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortBy,
      filters: filters,
    };
    setIsLoading(true);
    try {
      const res = await fetchData(params);
      setData(res.data);
      setTotalRecords(res.total);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching data:", err);
    }
  }, [currentPage, sortBy, itemsPerPage, debounceFilters]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const handleConfirmation = useCallback((item: any, type: string) => {
    setSelectedItem(item);
    setActionType(type);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (item: any) => {
      if (!onDelete) return;
      try {
        await onDelete(item);
        fetchTableData();
        setIsDialogOpen(false);
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    },
    [onDelete, fetchTableData]
  );

  const handleActionSingle = () => {
    if (!location.pathname.includes("hospital-details")) {
      navigate(`/${textkey}s/add-${textkey}`);
    } else if (onSystemAdminAction) {
      onSystemAdminAction("single");
    }
  };

  const handleActionMultiple = () => {
    if (!location.pathname.includes("hospital-details")) {
      navigate(`/${textkey}s/add-multiple-${textkey}s`);
    } else if (onSystemAdminAction) {
      onSystemAdminAction("multiple");
    }
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleSort = useCallback(
    (col: any) => {
      const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
      setSortBy({ [col.field]: newOrder });
      setSortOrder(newOrder);
    },
    [sortOrder]
  );

  const handleLimitChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="row1">
        {icon && <img src={icon} className="user-icon" alt="icon" />}
        <div className="user-list-title">
          {(currentTab || heading) && (
            <h4 className="heading">{currentTab || heading} List</h4>
          )}
        </div>

        {navKey && (
          <div className="button-container">
            <button
              className={`btn-success ${
                !permissionAccess(createPermission) ? "d-none" : ""
              }`}
              onClick={handleActionSingle}
            >
              <img
                src={plus}
                alt="Plus Icon"
                className="plus-icon default-icon"
              />
              {`Add ${
                heading
                  ? heading.endsWith("s")
                    ? heading.slice(0, -1)
                    : heading
                  : currentTab?.slice(0, -1)
              }`}
            </button>

            {buttonKey && (
              <button
                className={`btn-success ${
                  !permissionAccess(createPermission) ? "d-none" : ""
                }`}
                onClick={handleActionMultiple}
              >
                <img
                  src={plus}
                  alt="Plus Icon"
                  className="plus-icon default-icon"
                />
                Add Multiple {heading}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="table-container">
        <div className={`table-wrapper ${isLoading ? "loading" : ""}`}>
          {/* {isLoading && (
            <div className="table-loader">
              <LoaderSpinner />
            </div>
          )} */}
          <div className="table-toolbar">
            <div className="search-buttons-container">
              {(searchValue ||
                Object.keys(filters).length > 0 ||
                selectedColumns.length < columns.length) && (
                <>
                  {showSearchInput && (
                    <input
                      className="input-medium"
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
                      <button className="table-buttons secondary">
                        <img
                          src={settingsIcon}
                          className="col-icon"
                          alt="settings"
                        />
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
                        setCurrentPage(1);
                        setSelectedColumns(columns.map((col) => col.key));
                        fetchTableData();
                      }}
                    >
                      <img
                        src={refreshIcon}
                        className="col-icon"
                        alt="refresh"
                      />
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
              </select>
              {" entries"}
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                {columns
                  .filter((col) => selectedColumns.includes(col.key))
                  .map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col)}
                      className={col.sortable ? "sortable" : ""}
                    >
                      {col.label}
                    </th>
                  ))}
                {actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columns
                    .filter((col) => selectedColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key}>{item[col.field]}</td>
                    ))}
                  {actions && (
                    <td className="action-buttons">
                      {onEdit && (
                        <button
                          className={getActiveClass("UPDATE")}
                          onClick={() => handleConfirmation(item, "0")}
                        >
                          <img src={editIcon} alt="Edit" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className={getActiveClass("DELETE")}
                          onClick={() => handleConfirmation(item, "1")}
                        >
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
const [actionType, setActionType] = useState<string>("");
