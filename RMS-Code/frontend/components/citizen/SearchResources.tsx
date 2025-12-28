import { Download, FileText, Package, Search } from "lucide-react";
import { useRef, useState } from "react";

const categories = [
  "Μηχανήματα",
  "Οχήματα",
  "Εξοπλισμός",
  "Εργαλεία",
  "Υλικά Κατασκευών",
];

const mockSearchResults = [
  {
    id: "1",
    name: "Γερανός 20 Τόνων",
    category: "Μηχανήματα",
    status: "Διαθέσιμο",
    municipality: "Δήμος Πειραιά",
  },
  {
    id: "2",
    name: "Φορτηγό Iveco",
    category: "Οχήματα",
    status: "Σε Χρήση",
    municipality: "Δήμος Αμαρουσίου",
  },
  {
    id: "3",
    name: "Αντλία Λυμάτων",
    category: "Εξοπλισμός",
    status: "Διαθέσιμο",
    municipality: "Δήμος Περιστερίου",
  },
  {
    id: "4",
    name: "Ηλεκτρογεννήτρια 100KW",
    category: "Μηχανήματα",
    status: "Διαθέσιμο",
    municipality: "Δήμος Χαλανδρίου",
  },
];

export function SearchResources() {
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    setHasSearched(true);
    setShowReport(false);
    let results = mockSearchResults;

    if (filterType) {
      results = results.filter((r) => r.category === filterType);
    }

    if (filterStatus) {
      const statusMap: Record<string, string> = {
        available: "Διαθέσιμο",
        "in-use": "Σε Χρήση",
        lent: "Δανεισμένο",
      };
      results = results.filter((r) => r.status === statusMap[filterStatus]);
    }

    setSearchResults(results);
    if (results.length > 0) {
      setShowReport(true);
    }
  };

  const handleExport = async (format: "pdf" | "excel") => {
    if (format === "pdf") {
      // Dynamic import for jsPDF
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      // Add title
      pdf.setFontSize(18);
      pdf.text("Αναφορά Αναζήτησης Πόρων", 14, 20);

      // Add date
      pdf.setFontSize(10);
      pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString("el-GR")}`, 14, 30);

      // Add filters
      pdf.setFontSize(12);
      pdf.text("Φίλτρα Αναζήτησης:", 14, 40);
      pdf.setFontSize(10);
      pdf.text(`Τύπος Πόρου: ${filterType || "Όλοι"}`, 14, 47);
      pdf.text(`Κατάσταση: ${filterStatus || "Όλες"}`, 14, 54);

      // Add results
      pdf.setFontSize(12);
      pdf.text(`Αποτελέσματα (${searchResults.length}):`, 14, 65);

      let yPos = 75;
      searchResults.forEach((result, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${result.name}`, 14, yPos);
        pdf.text(`   Κατηγορία: ${result.category}`, 14, yPos + 5);
        pdf.text(`   Κατάσταση: ${result.status}`, 14, yPos + 10);
        pdf.text(`   Δήμος: ${result.municipality}`, 14, yPos + 15);
        yPos += 25;
      });

      pdf.save("anazetisi-poron.pdf");
    } else {
      // Dynamic import for XLSX
      const XLSX = await import("xlsx");
      // Excel export
      const ws = XLSX.utils.json_to_sheet(
        searchResults.map((r) => ({
          "Όνομα Πόρου": r.name,
          Κατηγορία: r.category,
          Κατάσταση: r.status,
          Δήμος: r.municipality,
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Πόροι");
      XLSX.writeFile(wb, "anazetisi-poron.xlsx");
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-white mb-8">Αναζήτηση Πόρων</h2>

      {/* Search Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <h3 className="text-xl text-white mb-4">Φίλτρα Αναζήτησης</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Τύπος Πόρου</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="" className="bg-slate-800">
                Όλοι οι τύποι
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Κατάσταση</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="" className="bg-slate-800">
                Όλες οι καταστάσεις
              </option>
              <option value="available" className="bg-slate-800">
                Διαθέσιμο
              </option>
              <option value="in-use" className="bg-slate-800">
                Σε Χρήση
              </option>
              <option value="lent" className="bg-slate-800">
                Δανεισμένο
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg"
            >
              <Search className="w-5 h-5" />
              Αναζήτηση
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {showReport && searchResults.length > 0 && (
        <div
          ref={reportRef}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6"
        >
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 font-medium">
              Η αναφορά δημιουργήθηκε επιτυχώς!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl text-white font-semibold">
              Προεπισκόπηση Αναφοράς
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors border border-green-500/30 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div>
            <h4 className="text-lg text-white mb-4">
              Αποτελέσματα ({searchResults.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white mb-1 truncate">
                        {result.name}
                      </h4>
                      <p className="text-sm text-gray-400">{result.category}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Κατάσταση:</span>
                      <span
                        className={`${
                          result.status === "Διαθέσιμο"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Δήμος:</span>
                      <span className="text-white text-xs">
                        {result.municipality}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results (when no report shown) */}
      {hasSearched && !showReport && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl text-white mb-4">
            Αποτελέσματα ({searchResults.length})
          </h3>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white mb-1 truncate">
                        {result.name}
                      </h4>
                      <p className="text-sm text-gray-400">{result.category}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Κατάσταση:</span>
                      <span
                        className={`${
                          result.status === "Διαθέσιμο"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Δήμος:</span>
                      <span className="text-white text-xs">
                        {result.municipality}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              Δεν βρέθηκαν πόροι με τα επιλεγμένα κριτήρια.
            </p>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
          <p className="text-purple-300">
            Επιλέξτε φίλτρα και πατήστε "Αναζήτηση" για να δείτε διαθέσιμους
            πόρους.
          </p>
        </div>
      )}
    </div>
  );
}
