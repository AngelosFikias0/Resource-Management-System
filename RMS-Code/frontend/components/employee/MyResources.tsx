import {
  AlertCircle,
  ChevronDown,
  Edit,
  Filter,
  Loader2,
  Package,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Resource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchasePrice?: number;
  status: "available" | "in-use";
  municipality: string;
  createdAt?: string;
}

const CATEGORIES = [
  "Μηχανήματα",
  "Οχήματα",
  "Εξοπλισμός",
  "Εργαλεία",
  "Υλικά Κατασκευών",
  "Άλλο",
] as const;

const UNITS = ["Τεμάχια", "Κιλά", "Μέτρα", "Λίτρα", "Τόνοι"] as const;

const STATUS_CONFIG = {
  available: {
    label: "Διαθέσιμο",
    color: "bg-green-500/20 text-green-400 border-green-500/50",
  },
  "in-use": {
    label: "Σε Χρήση",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  },
} as const;

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Εκσκαφέας Κοματσού",
    category: "Μηχανήματα",
    quantity: 2,
    unit: "Τεμάχια",
    purchasePrice: 25000,
    status: "available",
    municipality: "Δήμος Αθηναίων",
  },
  {
    id: "2",
    name: "Φορτηγό Mercedes",
    category: "Οχήματα",
    quantity: 5,
    unit: "Τεμάχια",
    purchasePrice: 18000,
    status: "in-use",
    municipality: "Δήμος Αθηναίων",
  },
  {
    id: "3",
    name: "Αντλία Νερού",
    category: "Εξοπλισμός",
    quantity: 10,
    unit: "Τεμάχια",
    purchasePrice: 450,
    status: "available",
    municipality: "Δήμος Αθηναίων",
  },
  {
    id: "4",
    name: "Τσιμέντο",
    category: "Υλικά Κατασκευών",
    quantity: 500,
    unit: "Κιλά",
    purchasePrice: 2.5,
    status: "available",
    municipality: "Δήμος Αθηναίων",
  },
  {
    id: "5",
    name: "Γεννήτρια 50KW",
    category: "Μηχανήματα",
    quantity: 3,
    unit: "Τεμάχια",
    purchasePrice: 7500,
    status: "in-use",
    municipality: "Δήμος Αθηναίων",
  },
];

export function MyResources() {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted resources from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rms_resources");
      if (raw) {
        const data = JSON.parse(raw) as Resource[];
        if (Array.isArray(data) && data.length > 0) {
          setResources(data);
        }
      }
    } catch (err) {
      console.error("Failed to load resources from localStorage", err);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [editFormData, setEditFormData] = useState<Resource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || resource.category === filterCategory;
      const matchesStatus = !filterStatus || resource.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [resources, searchTerm, filterCategory, filterStatus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deleteConfirm) setDeleteConfirm(null);
        if (editResource) handleCancelEdit();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [deleteConfirm, editResource]);

  const handleEdit = (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (resource) {
      setEditResource(resource);
      setEditFormData({ ...resource });
      setEditError(null);
    }
  };

  const handleCancelEdit = () => {
    setEditResource(null);
    setEditFormData(null);
    setEditError(null);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [name]:
          name === "quantity"
            ? parseInt(value) || 0
            : name === "purchasePrice"
            ? parseFloat(value) || 0
            : value,
      });
      if (editError) setEditError(null);
    }
  };

  const validateEditForm = (): string | null => {
    if (!editFormData) return "Σφάλμα φόρμας";
    if (!editFormData.name.trim()) return "Το όνομα είναι υποχρεωτικό";
    if (!editFormData.category) return "Η κατηγορία είναι υποχρεωτική";
    if (editFormData.quantity < 1)
      return "Η ποσότητα πρέπει να είναι τουλάχιστον 1";
    if (!editFormData.unit) return "Η μονάδα είναι υποχρεωτική";
    if (!editFormData.status) return "Η κατάσταση είναι υποχρεωτική";
    if (typeof editFormData.purchasePrice === "number" && editFormData.purchasePrice < 0)
      return "Η τιμή αγοράς δεν μπορεί να είναι αρνητική";
    return null;
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    const validationError = validateEditForm();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const updated = resources.map((r) =>
        r.id === editFormData.id ? editFormData : r
      );
      setResources(updated);
      try {
        localStorage.setItem("rms_resources", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist edited resources", err);
      }

      handleCancelEdit();
    } catch (err) {
      setEditError("Σφάλμα κατά την ενημέρωση. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updated = resources.filter((r) => r.id !== resourceId);
      setResources(updated);
      try {
        localStorage.setItem("rms_resources", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist resources after delete", err);
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError("Αποτυχία διαγραφής πόρου. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
  };

  const hasActiveFilters = searchTerm || filterCategory || filterStatus;

  return (
    <div>
      <div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Οι Πόροι Μου
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              aria-expanded={showFilters}
              aria-controls="filters-section"
            >
              <Filter className="w-4 h-4" />
              <span>Φίλτρα</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <p className="text-gray-400">
            Διαχείριση {filteredResources.length} πόρ
            {filteredResources.length === 1 ? "ου" : "ων"}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
              aria-label="Κλείσιμο μηνύματος"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {showFilters && (
          <div
            id="filters-section"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="sr-only">
                  Αναζήτηση πόρου
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Αναζήτηση πόρου..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category-filter" className="sr-only">
                  Φιλτράρισμα κατηγορίας
                </label>
                <select
                  id="category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                >
                  <option value="" className="bg-slate-800 text-gray-400">
                    Όλες οι κατηγορίες
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-slate-800 text-white"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status-filter" className="sr-only">
                  Φιλτράρισμα κατάστασης
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                >
                  <option value="" className="bg-slate-800 text-gray-400">
                    Όλες οι καταστάσεις
                  </option>
                  {Object.entries(STATUS_CONFIG).map(([key, value]) => (
                    <option
                      key={key}
                      value={key}
                      className="bg-slate-800 text-white"
                    >
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Καθαρισμός φίλτρων
                </button>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}

        {!isLoading && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl text-white mb-1 truncate font-semibold">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {resource.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${
                      STATUS_CONFIG[resource.status].color
                    }`}
                  >
                    {STATUS_CONFIG[resource.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Ποσότητα</p>
                    <p className="text-white font-medium">
                      {resource.quantity} {resource.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Δήμος</p>
                    <p className="text-white font-medium truncate">
                      {resource.municipality}
                    </p>
                    {typeof resource.purchasePrice === "number" && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400 mb-1">Τιμή Αγοράς</p>
                        <p className="text-white font-medium">
                          {resource.purchasePrice.toLocaleString("el-GR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(resource.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors font-medium"
                    aria-label={`Επεξεργασία ${resource.name}`}
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Επεξεργασία</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(resource.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
                    aria-label={`Διαγραφή ${resource.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Διαγραφή</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              {hasActiveFilters
                ? "Δεν βρέθηκαν πόροι με αυτά τα κριτήρια"
                : "Δεν έχετε καταχωρήσει πόρους ακόμα"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Καθαρισμός φίλτρων
              </button>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {editResource && editFormData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dialog-title"
          >
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => !isSaving && handleCancelEdit()}
              aria-hidden="true"
            />

            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Edit className="text-blue-400 w-5 h-5" />
                  </div>
                  <h3
                    id="edit-dialog-title"
                    className="text-2xl font-bold text-white"
                  >
                    Επεξεργασία Πόρου
                  </h3>
                </div>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Κλείσιμο"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {editError && (
                <div
                  className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{editError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-gray-300 mb-2 font-medium text-sm"
                  >
                    Όνομα Πόρου <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                    placeholder="π.χ. Εκσκαφέας Κοματσού"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="edit-category"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Κατηγορία <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="edit-category"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-status"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Κατάσταση <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, value]) => (
                        <option key={key} value={key} className="bg-slate-800">
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="edit-quantity"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Ποσότητα <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="edit-quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={editFormData.quantity}
                      onChange={handleEditInputChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-unit"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Μονάδα Μέτρησης <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="edit-unit"
                      name="unit"
                      value={editFormData.unit}
                      onChange={handleEditInputChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                    >
                      {UNITS.map((unit) => (
                        <option
                          key={unit}
                          value={unit}
                          className="bg-slate-800"
                        >
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-municipality"
                    className="block text-gray-300 mb-2 font-medium text-sm"
                  >
                    Δήμος
                  </label>
                  <input
                    id="edit-municipality"
                    name="municipality"
                    type="text"
                    value={editFormData.municipality}
                    onChange={handleEditInputChange}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Αποθήκευση...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Αποθήκευση</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteConfirm(null)}
              aria-hidden="true"
            />

            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative z-10 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="text-red-400 w-6 h-6" />
                </div>

                <h3
                  id="delete-dialog-title"
                  className="text-xl font-bold text-white mb-2"
                >
                  Επιβεβαίωση Διαγραφής
                </h3>

                <p className="text-slate-400 text-sm mb-6">
                  Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον πόρο; Αυτή η
                  ενέργεια δεν μπορεί να αναιρεθεί.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ακύρωση
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Διαγραφή...</span>
                      </>
                    ) : (
                      "Διαγραφή"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
