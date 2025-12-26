import {
  Building2,
  Calendar,
  CheckCircle,
  MapPin,
  Package,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Resource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  municipality: string;
  distance: string;
}

interface PendingRequest {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  municipality: string;
  status: string;
  date: string;
}

export default function OtherMunicipalityResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMunicipality, setFilterMunicipality] = useState("");

  const [viewDetailsResource, setViewDetailsResource] =
    useState<Resource | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [justification, setJustification] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  const resources: Resource[] = [
    {
      id: "1",
      name: "Γερανός 20 Τόνων",
      category: "Μηχανήματα",
      quantity: 1,
      unit: "Τεμάχια",
      municipality: "Δήμος Πειραιά",
      distance: "8 km",
    },
    {
      id: "2",
      name: "Ασφαλτόστρωση",
      category: "Υλικά Κατασκευών",
      quantity: 2000,
      unit: "Κιλά",
      municipality: "Δήμος Καλλιθέας",
      distance: "5 km",
    },
    {
      id: "3",
      name: "Αντλία Λυμάτων",
      category: "Εξοπλισμός",
      quantity: 3,
      unit: "Τεμάχια",
      municipality: "Δήμος Περιστερίου",
      distance: "12 km",
    },
    {
      id: "4",
      name: "Φορτηγό Iveco",
      category: "Οχήματα",
      quantity: 2,
      unit: "Τεμάχια",
      municipality: "Δήμος Αμαρουσίου",
      distance: "15 km",
    },
    {
      id: "5",
      name: "Χωματουργικά Εργαλεία",
      category: "Εργαλεία",
      quantity: 50,
      unit: "Τεμάχια",
      municipality: "Δήμος Γλυφάδας",
      distance: "18 km",
    },
    {
      id: "6",
      name: "Ηλεκτρογεννήτρια 100KW",
      category: "Μηχανήματα",
      quantity: 1,
      unit: "Τεμάχια",
      municipality: "Δήμος Χαλανδρίου",
      distance: "10 km",
    },
    {
      id: "7",
      name: "Γερανός 15 Τόνων",
      category: "Μηχανήματα",
      quantity: 1,
      unit: "Τεμάχια",
      municipality: "Δήμος Καλλιθέας",
      distance: "5 km",
    },
    {
      id: "8",
      name: "Φορτηγό με Γερανό",
      category: "Οχήματα",
      quantity: 3,
      unit: "Τεμάχια",
      municipality: "Δήμος Χαλανδρίου",
      distance: "10 km",
    },
  ];

  const categories = [
    "Μηχανήματα",
    "Οχήματα",
    "Εξοπλισμός",
    "Εργαλεία",
    "Υλικά Κατασκευών",
    "Άλλο",
  ];
  const municipalities = [...new Set(resources.map((r) => r.municipality))];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || resource.category === filterCategory;
    const matchesMunicipality =
      !filterMunicipality || resource.municipality === filterMunicipality;
    return matchesSearch && matchesCategory && matchesMunicipality;
  });

  // Check if a resource already has a pending request
  const hasExistingRequest = (resourceId: string) => {
    return pendingRequests.some((req) => req.resourceId === resourceId);
  };

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    let timeoutId: number | undefined;
    if (showSuccess) {
      timeoutId = window.setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [showSuccess]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && viewDetailsResource) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [viewDetailsResource]);

  const handleRequestClick = () => {
    setShowRequestForm(true);
  };

  const handleSubmitRequest = () => {
    if (!viewDetailsResource || !quantityNeeded || !justification) {
      return;
    }

    const quantity = parseInt(quantityNeeded);

    // Validate quantity
    if (
      isNaN(quantity) ||
      quantity <= 0 ||
      quantity > viewDetailsResource.quantity
    ) {
      return;
    }

    // Check if request already exists
    if (hasExistingRequest(viewDetailsResource.id)) {
      return;
    }

    const newRequest: PendingRequest = {
      id: `REQ-${Date.now()}`,
      resourceId: viewDetailsResource.id,
      resourceName: viewDetailsResource.name,
      quantity: quantity,
      municipality: viewDetailsResource.municipality,
      status: "Σε αναμονή έγκρισης",
      date: new Date().toISOString(),
    };

    setPendingRequests([...pendingRequests, newRequest]);
    setShowSuccess(true);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setViewDetailsResource(null);
    setShowRequestForm(false);
    setQuantityNeeded("");
    setJustification("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterMunicipality("");
  };

  const hasActiveFilters = searchTerm || filterCategory || filterMunicipality;

  const isFormValid =
    quantityNeeded &&
    justification &&
    parseInt(quantityNeeded) > 0 &&
    viewDetailsResource &&
    parseInt(quantityNeeded) <= viewDetailsResource.quantity;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Πόροι Άλλων Δήμων
        </h2>
        <p className="text-gray-400">
          Περιήγηση και αίτηση πόρων από γειτονικούς δήμους
        </p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-400 font-semibold">Αίτηση Υποβλήθηκε!</p>
            <p className="text-sm text-green-300 mt-1">
              Η αίτησή σας καταχωρήθηκε στο σύστημα με κατάσταση "Σε αναμονή
              έγκρισης".
            </p>
          </div>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl text-white font-semibold mb-4">
            Οι Αιτήσεις Μου
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {request.resourceName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{request.quantity} τεμ.</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {request.municipality}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(request.date).toLocaleDateString("el-GR")}
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/50 whitespace-nowrap font-medium">
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Αναζήτηση πόρου..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              aria-label="Αναζήτηση πόρου"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            aria-label="Φίλτρο κατηγορίας"
          >
            <option value="" className="bg-slate-800">
              Όλες οι κατηγορίες
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterMunicipality}
            onChange={(e) => setFilterMunicipality(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            aria-label="Φίλτρο δήμου"
          >
            <option value="" className="bg-slate-800">
              Όλοι οι δήμοι
            </option>
            {municipalities.map((mun) => (
              <option key={mun} value={mun} className="bg-slate-800">
                {mun}
              </option>
            ))}
          </select>
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

      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
        <p className="text-blue-300 text-sm">
          Προβολή διαθέσιμων πόρων από γειτονικούς δήμους. Κάντε κλικ σε
          "Προβολή Λεπτομερειών" για να υποβάλετε αίτηση δανεισμού.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const alreadyRequested = hasExistingRequest(resource.id);

          return (
            <div
              key={resource.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all hover:shadow-xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg text-white mb-1 truncate font-semibold">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-gray-400">{resource.category}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300 truncate">
                    {resource.municipality}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Ποσότητα:</span>
                  <span className="text-white font-medium">
                    {resource.quantity} {resource.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Απόσταση:</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-white font-medium">
                      {resource.distance}
                    </span>
                  </div>
                </div>
              </div>

              {alreadyRequested ? (
                <div className="w-full px-4 py-2.5 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/50 text-center font-medium">
                  Αίτηση Υποβλήθηκε
                </div>
              ) : (
                <button
                  onClick={() => setViewDetailsResource(resource)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all font-medium shadow-lg"
                >
                  Προβολή Λεπτομερειών
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            {hasActiveFilters
              ? "Δεν βρέθηκαν πόροι με αυτά τα κριτήρια"
              : "Δεν βρέθηκαν διαθέσιμοι πόροι"}
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

      {viewDetailsResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    id="modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    {viewDetailsResource.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {viewDetailsResource.category}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Κλείσιμο"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!showRequestForm ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-400">Δήμος</span>
                    </div>
                    <p className="text-white font-medium">
                      {viewDetailsResource.municipality}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm text-gray-400 mb-2">Ποσότητα</p>
                      <p className="text-white font-medium text-lg">
                        {viewDetailsResource.quantity}{" "}
                        {viewDetailsResource.unit}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-400">Απόσταση</p>
                      </div>
                      <p className="text-white font-medium text-lg">
                        {viewDetailsResource.distance}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      Κάντε κλικ στο κουμπί παρακάτω για να υποβάλετε αίτηση
                      δανεισμού για αυτόν τον πόρο.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRequestClick}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium shadow-lg"
                >
                  Υποβολή Αίτησης
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 text-sm">
                    Αίτηση για:{" "}
                    <span className="text-white font-medium">
                      {viewDetailsResource.name}
                    </span>{" "}
                    από{" "}
                    <span className="text-white font-medium">
                      {viewDetailsResource.municipality}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="quantity-input"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Ποσότητα που Χρειάζεστε{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="quantity-input"
                      type="number"
                      min="1"
                      max={viewDetailsResource.quantity}
                      value={quantityNeeded}
                      onChange={(e) => setQuantityNeeded(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                      placeholder={`Μέγιστο: ${viewDetailsResource.quantity} ${viewDetailsResource.unit}`}
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="justification-input"
                      className="block text-gray-300 mb-2 font-medium text-sm"
                    >
                      Αιτιολόγηση <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="justification-input"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors resize-none"
                      placeholder="Εξηγήστε γιατί χρειάζεστε τον πόρο και πώς θα χρησιμοποιηθεί..."
                      aria-required="true"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Πίσω
                    </button>
                    <button
                      onClick={handleSubmitRequest}
                      disabled={!isFormValid}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Υποβολή
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
