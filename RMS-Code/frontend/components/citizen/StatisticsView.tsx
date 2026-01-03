import {
  Activity,
  Download,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface StatData {
  totalResources: number;
  inUse: number;
  available: number;
  resourcesByCategory: { category: string; count: number }[];
}

const stats: StatData = {
  totalResources: 245,
  inUse: 58,
  available: 187,
  resourcesByCategory: [
    { category: "Μηχανήματα", count: 45 },
    { category: "Οχήματα", count: 68 },
    { category: "Εξοπλισμός", count: 87 },
    { category: "Εργαλεία", count: 32 },
    { category: "Υλικά Κατασκευών", count: 13 },
  ],
};

export function StatisticsView() {
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [totalExchangedValue, setTotalExchangedValue] = useState(0);

  useEffect(() => {
    try {
      // Try to read persisted transactions first
      const txRaw = localStorage.getItem("rms_transactions");
      const resRaw = localStorage.getItem("rms_resources");

      let completedCount = 0;
      let totalValue = 0;

      if (txRaw) {
        const txs = JSON.parse(txRaw) as any[];
        completedCount = txs.filter((t: any) => t.status === "completed").length;
        totalValue = txs.reduce((acc: number, t: any) => acc + (Number(t.totalValue) || 0), 0);
      } else {
        // fallback: no transactions stored; compute total value from resources in-use
        completedCount = 0;
        if (resRaw) {
          const resources = JSON.parse(resRaw) as any[];
          totalValue = resources
            .filter((r: any) => r.status === "in-use")
            .reduce((acc: number, r: any) => acc + ((Number(r.purchasePrice) || 0) * (Number(r.quantity) || 0)), 0);
        }
      }

      setCompletedTransactions(completedCount);
      setTotalExchangedValue(totalValue);
    } catch (err) {
      console.error("Failed to compute statistics from localStorage", err);
    }
  }, []);

  const handleExport = async (format: "pdf" | "excel") => {
    if (format === "pdf") {
      // Dynamic import for jsPDF
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      // Add title
      pdf.setFontSize(18);
      pdf.text("Στατιστικά Πόρων", 14, 20);

      // Add date
      pdf.setFontSize(10);
      pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString("el-GR")}`, 14, 30);

      // Add summary statistics
      pdf.setFontSize(12);
      pdf.text("Γενικά Στατιστικά:", 14, 45);
      pdf.setFontSize(10);
      pdf.text(`Συνολικοί Πόροι: ${stats.totalResources}`, 14, 52);
      pdf.text(`Σε Χρήση: ${stats.inUse}`, 14, 59);
      pdf.text(`Διαθέσιμοι: ${stats.available}`, 14, 66);

      // Add category breakdown
      pdf.setFontSize(12);
      pdf.text("Πόροι ανά Κατηγορία:", 14, 80);

      let yPos = 90;
      stats.resourcesByCategory.forEach((item) => {
        const percentage = (item.count / stats.totalResources) * 100;
        pdf.setFontSize(10);
        pdf.text(
          `${item.category}: ${item.count} (${percentage.toFixed(1)}%)`,
          14,
          yPos
        );
        yPos += 7;
      });

      pdf.save("statistika-poron.pdf");
    } else {
      // Dynamic import for XLSX
      const XLSX = await import("xlsx");
      // Excel export
      const summaryData = [
        { Μέτρηση: "Συνολικοί Πόροι", Αξία: stats.totalResources },
        { Μέτρηση: "Σε Χρήση", Αξία: stats.inUse },
        { Μέτρηση: "Διαθέσιμοι", Αξία: stats.available },
      ];

      const categoryData = stats.resourcesByCategory.map((item) => ({
        Κατηγορία: item.category,
        Πλήθος: item.count,
        "Ποσοστό %": ((item.count / stats.totalResources) * 100).toFixed(1),
      }));

      const wb = XLSX.utils.book_new();

      const ws1 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, "Γενικά Στατιστικά");

      const ws2 = XLSX.utils.json_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, ws2, "Ανά Κατηγορία");

      XLSX.writeFile(wb, "statistika-poron.xlsx");
    }
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl text-white">Στατιστικά Πόρων</h2>
        {!showReport && (
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg font-medium"
          >
            <FileText className="w-4 h-4" />
            Δημιουργία Αναφοράς
          </button>
        )}
      </div>

      {/* Report Preview */}
      {showReport && (
        <div
          ref={reportRef}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
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

          {/* Report Content */}
          <div className="space-y-6">
            {/* General Statistics */}
            <div>
              <h4 className="text-lg text-white mb-4 font-semibold">
                Γενικά Στατιστικά
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-purple-400" />
                    <p className="text-gray-300 text-sm">Συνολικοί</p>
                  </div>
                  <p className="text-3xl text-purple-400 font-bold">
                    {stats.totalResources}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <p className="text-gray-300 text-sm">Σε Χρήση</p>
                  </div>
                  <p className="text-3xl text-blue-400 font-bold">
                    {stats.inUse}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <p className="text-gray-300 text-sm">Διαθέσιμοι</p>
                  </div>
                  <p className="text-3xl text-green-400 font-bold">
                    {stats.available}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <p className="text-gray-300 text-sm">Ολοκληρωμένες Συναλλαγές</p>
                  </div>
                  <p className="text-3xl text-yellow-400 font-bold">{completedTransactions}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <p className="text-gray-300 text-sm">Συνολική Αξία Ανταλλαγών</p>
                  </div>
                  <p className="text-3xl text-emerald-400 font-bold">
                    {totalExchangedValue.toLocaleString("el-GR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Resources by Category */}
            <div>
              <h4 className="text-lg text-white mb-4 font-semibold">
                Πόροι ανά Κατηγορία
              </h4>
              <div className="space-y-4">
                {stats.resourcesByCategory.map((item, index) => {
                  const percentage = (item.count / stats.totalResources) * 100;
                  return (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">
                          {item.category}
                        </span>
                        <span className="text-white font-semibold">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Statistics View (when no report) */}
      {!showReport && (
        <>
          {/* General Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-purple-400" />
                <p className="text-gray-300">Συνολικοί Πόροι</p>
              </div>
              <p className="text-4xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.totalResources}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-blue-400" />
                <p className="text-gray-300">Σε Χρήση</p>
              </div>
              <p className="text-4xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stats.inUse}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <p className="text-gray-300">Διαθέσιμοι</p>
              </div>
              <p className="text-4xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {stats.available}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-yellow-400" />
                <p className="text-gray-300">Ολοκληρωμένες Συναλλαγές</p>
              </div>
              <p className="text-4xl bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">{completedTransactions}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
                <p className="text-gray-300">Συνολική Αξία Ανταλλαγών</p>
              </div>
              <p className="text-4xl bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">{totalExchangedValue.toLocaleString("el-GR", { style: "currency", currency: "EUR" })}</p>
            </div>
          </div>

          {/* Resources by Category */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl text-white mb-6">Πόροι ανά Κατηγορία</h3>
            <div className="space-y-4">
              {stats.resourcesByCategory.map((item, index) => {
                const percentage = (item.count / stats.totalResources) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{item.category}</span>
                      <span className="text-white">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
            <p className="text-purple-300">
              Τα στατιστικά ενημερώνονται σε πραγματικό χρόνο και παρέχουν πλήρη
              διαφάνεια στη διαχείριση των δημοτικών πόρων.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
