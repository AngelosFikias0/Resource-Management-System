import { Calendar, Download, FileText } from "lucide-react";
import { useRef, useState } from "react";

export default function Reports() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    resourceType: "",
    status: "",
  });

  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const [reportData] = useState({
    totalResources: 245,
    activeLoans: 8,
    pendingRequests: 12,
    completedTransactions: 156,
    resourcesByCategory: [
      { category: "Μηχανήματα", count: 45 },
      { category: "Οχήματα", count: 68 },
      { category: "Εξοπλισμός", count: 87 },
      { category: "Εργαλεία", count: 32 },
      { category: "Υλικά Κατασκευών", count: 13 },
    ],
  });

  const categories = [
    "Μηχανήματα",
    "Οχήματα",
    "Εξοπλισμός",
    "Εργαλεία",
    "Υλικά Κατασκευών",
    "Άλλο",
  ];

  const handleExport = async (format: "pdf" | "excel") => {
    if (format === "pdf") {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      pdf.setFontSize(18);
      pdf.text("Αναφορά Διαχείρισης Πόρων", 14, 20);

      pdf.setFontSize(10);
      pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString("el-GR")}`, 14, 30);

      pdf.setFontSize(12);
      pdf.text("Γενικά Στατιστικά:", 14, 45);
      pdf.setFontSize(10);
      pdf.text(`Συνολικοί Πόροι: ${reportData.totalResources}`, 14, 52);
      pdf.text(`Ενεργοί Δανεισμοί: ${reportData.activeLoans}`, 14, 59);
      pdf.text(`Εκκρεμείς Αιτήσεις: ${reportData.pendingRequests}`, 14, 66);
      pdf.text(
        `Ολοκληρωμένες Συναλλαγές: ${reportData.completedTransactions}`,
        14,
        73
      );

      pdf.setFontSize(12);
      pdf.text("Πόροι ανά Κατηγορία:", 14, 87);

      let yPos = 97;
      reportData.resourcesByCategory.forEach((item) => {
        const percentage = (item.count / reportData.totalResources) * 100;
        pdf.setFontSize(10);
        pdf.text(
          `${item.category}: ${item.count} (${percentage.toFixed(1)}%)`,
          14,
          yPos
        );
        yPos += 7;
      });

      pdf.save("anafora-poron.pdf");
    } else {
      const XLSX = await import("xlsx");

      const summaryData = [
        { Μέτρηση: "Συνολικοί Πόροι", Αξία: reportData.totalResources },
        { Μέτρηση: "Ενεργοί Δανεισμοί", Αξία: reportData.activeLoans },
        { Μέτρηση: "Εκκρεμείς Αιτήσεις", Αξία: reportData.pendingRequests },
        {
          Μέτρηση: "Ολοκληρωμένες Συναλλαγές",
          Αξία: reportData.completedTransactions,
        },
      ];

      const categoryData = reportData.resourcesByCategory.map((item) => ({
        Κατηγορία: item.category,
        Πλήθος: item.count,
        "Ποσοστό %": ((item.count / reportData.totalResources) * 100).toFixed(
          1
        ),
      }));

      const wb = XLSX.utils.book_new();

      const ws1 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, "Γενικά Στατιστικά");

      const ws2 = XLSX.utils.json_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, ws2, "Ανά Κατηγορία");

      XLSX.writeFile(wb, "anafora-poron.xlsx");
    }
  };

  const handleGenerateReport = () => {
    setShowReport(true);
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Αναφορές
        </h2>
        <p className="text-gray-400">
          Δημιουργία και εξαγωγή αναφορών διαχείρισης πόρων
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
        <h3 className="text-xl text-white mb-4 font-semibold">
          Φίλτρα Αναφοράς
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Από Ημερομηνία
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Έως Ημερομηνία
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Τύπος Πόρου
            </label>
            <select
              value={filters.resourceType}
              onChange={(e) =>
                setFilters({ ...filters, resourceType: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
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
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Κατάσταση
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
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
              <option value="pending" className="bg-slate-800">
                Σε Αναμονή
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleGenerateReport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg font-medium"
          >
            <FileText className="w-5 h-5" />
            Προβολή Αναφοράς
          </button>
          <button
            onClick={() => {
              setFilters({
                startDate: "",
                endDate: "",
                resourceType: "",
                status: "",
              });
              setShowReport(false);
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 font-medium"
          >
            Καθαρισμός Φίλτρων
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {showReport && (
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

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Συνολικοί Πόροι</p>
              <p className="text-3xl text-white font-bold">
                {reportData.totalResources}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Ενεργοί Δανεισμοί</p>
              <p className="text-3xl text-white font-bold">
                {reportData.activeLoans}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Εκκρεμείς Αιτήσεις</p>
              <p className="text-3xl text-white font-bold">
                {reportData.pendingRequests}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">
                Ολοκληρωμένες Συναλλαγές
              </p>
              <p className="text-3xl text-white font-bold">
                {reportData.completedTransactions}
              </p>
            </div>
          </div>

          {/* Resources by Category */}
          <div>
            <h4 className="text-lg text-white mb-4 font-semibold">
              Πόροι ανά Κατηγορία
            </h4>
            <div className="space-y-4">
              {reportData.resourcesByCategory.map((item, index) => {
                const percentage =
                  (item.count / reportData.totalResources) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300 font-medium">
                        {item.category}
                      </span>
                      <span className="text-white font-semibold">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Report Info */}
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 mb-1 font-medium">
              Πληροφορίες Αναφοράς
            </p>
            <p className="text-sm text-blue-200">
              Οι αναφορές δημιουργούνται σε πραγματικό χρόνο με βάση τα
              επιλεγμένα φίλτρα. Μπορείτε να εξάγετε τα δεδομένα σε μορφή PDF ή
              Excel για περαιτέρω ανάλυση και αρχειοθέτηση.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
