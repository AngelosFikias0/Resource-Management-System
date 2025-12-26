import {
  Building2,
  CheckCircle,
  Clock,
  Eye,
  Package,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Request {
  id: string;
  resourceName: string;
  category: string;
  requestedBy: string;
  fromMunicipality: string;
  quantity: number;
  unit: string;
  justification: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export default function PendingApprovals() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      resourceName: "Εκσκαφέας Κοματσού",
      category: "Μηχανήματα",
      requestedBy: "Γιώργος Παπαδόπουλος",
      fromMunicipality: "Δήμος Πειραιά",
      quantity: 1,
      unit: "Τεμάχια",
      justification:
        "Απαιτείται για εργασίες ανακατασκευής οδού στην περιοχή Καλλιθέας. Το έργο έχει προθεσμία 2 εβδομάδων.",
      date: "2025-12-08",
      status: "pending",
    },
    {
      id: "2",
      resourceName: "Αντλία Νερού",
      category: "Εξοπλισμός",
      requestedBy: "Μαρία Κωνσταντίνου",
      fromMunicipality: "Δήμος Χαλανδρίου",
      quantity: 2,
      unit: "Τεμάχια",
      justification:
        "Χρειάζεται για άντληση νερού από πλημμυρισμένη περιοχή. Επείγουσα ανάγκη.",
      date: "2025-12-09",
      status: "pending",
    },
    {
      id: "3",
      resourceName: "Φορτηγό Mercedes",
      category: "Οχήματα",
      requestedBy: "Νίκος Αλεξόπουλος",
      fromMunicipality: "Δήμος Γλυφάδας",
      quantity: 1,
      unit: "Τεμάχια",
      justification: "Μεταφορά υλικών για έργα συντήρησης δημοτικών κτιρίων.",
      date: "2025-12-07",
      status: "pending",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>("");

  useEffect(() => {
    let timeoutId: number | undefined;
    if (showSuccessMessage) {
      timeoutId = window.setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    }
    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [showSuccessMessage]);

  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    );
    setShowSuccessMessage("approved");
    setSelectedRequest(null);
  };

  const handleReject = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );
    setShowSuccessMessage("rejected");
    setSelectedRequest(null);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Εκκρεμείς Αιτήσεις
          </h2>
          <p className="text-gray-400">
            Έγκριση ή απόρριψη αιτήσεων δανεισμού πόρων από άλλους δήμους
          </p>
        </div>

        {showSuccessMessage && (
          <div
            className={`mb-6 border rounded-lg p-4 flex items-start gap-3 ${
              showSuccessMessage === "approved"
                ? "bg-green-500/20 border-green-500/50"
                : "bg-red-500/20 border-red-500/50"
            }`}
          >
            {showSuccessMessage === "approved" ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-semibold">
                    Αίτηση Εγκρίθηκε!
                  </p>
                  <p className="text-sm text-green-300 mt-1">
                    Τα αποθέματα ενημερώθηκαν και στάλθηκε ειδοποίηση στον
                    αιτούντα.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-semibold">
                    Αίτηση Απορρίφθηκε
                  </p>
                  <p className="text-sm text-red-300 mt-1">
                    Στάλθηκε ειδοποίηση απόρριψης στον αιτούντα.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-400" />
            Αιτήσεις σε Αναμονή ({pendingRequests.length})
          </h3>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl text-white mb-1 font-semibold">
                            {request.resourceName}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {request.category}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">Αιτών</p>
                          <p className="text-white font-medium">
                            {request.requestedBy}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">Δήμος</p>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <p className="text-white font-medium">
                              {request.fromMunicipality}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">Ποσότητα</p>
                          <p className="text-white font-medium">
                            {request.quantity} {request.unit}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-sm text-gray-400 mb-1">
                            Ημερομηνία
                          </p>
                          <p className="text-white font-medium">
                            {new Date(request.date).toLocaleDateString("el-GR")}
                          </p>
                        </div>
                      </div>

                      {selectedRequest?.id === request.id && (
                        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-300 font-medium mb-2">
                            Αιτιολόγηση
                          </p>
                          <p className="text-gray-200">
                            {request.justification}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row gap-2 lg:flex-col lg:min-w-[160px]">
                      <button
                        onClick={() =>
                          setSelectedRequest(
                            selectedRequest?.id === request.id ? null : request
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors font-medium border border-blue-500/30"
                        aria-label={
                          selectedRequest?.id === request.id
                            ? "Απόκρυψη λεπτομερειών"
                            : "Προβολή λεπτομερειών"
                        }
                      >
                        <Eye className="w-4 h-4" />
                        <span className="whitespace-nowrap">
                          {selectedRequest?.id === request.id
                            ? "Απόκρυψη"
                            : "Λεπτομέρειες"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors font-medium border border-green-500/30"
                        aria-label="Έγκριση αίτησης"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="whitespace-nowrap">Έγκριση</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium border border-red-500/30"
                        aria-label="Απόρριψη αίτησης"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="whitespace-nowrap">Απόρριψη</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Δεν υπάρχουν εκκρεμείς αιτήσεις
              </p>
            </div>
          )}
        </div>

        {processedRequests.length > 0 && (
          <div>
            <h3 className="text-xl text-white font-semibold mb-4">
              Επεξεργασμένες Αιτήσεις ({processedRequests.length})
            </h3>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          request.status === "approved"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {request.status === "approved" ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {request.resourceName}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {request.requestedBy} - {request.fromMunicipality}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        request.status === "approved"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {request.status === "approved"
                        ? "Εγκρίθηκε"
                        : "Απορρίφθηκε"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
