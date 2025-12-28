import { Download, FileText } from "lucide-react";
import { useRef, useState } from "react";

const recentActions = [
  {
    id: "1",
    action: "Δανεισμός Εκσκαφέα",
    municipality: "Προς Δήμο Πειραιά",
    date: "2025-12-09",
    status: "completed",
  },
  {
    id: "2",
    action: "Λήψη Αντλίας Νερού",
    municipality: "Από Δήμο Καλλιθέας",
    date: "2025-12-08",
    status: "completed",
  },
  {
    id: "3",
    action: "Καταγραφή Νέου Οχήματος",
    municipality: "Δήμος Αθηναίων",
    date: "2025-12-07",
    status: "completed",
  },
  {
    id: "4",
    action: "Επιστροφή Γερανού",
    municipality: "Προς Δήμο Χαλανδρίου",
    date: "2025-12-06",
    status: "completed",
  },
  {
    id: "5",
    action: "Δανεισμός Ηλεκτρογεννήτριας",
    municipality: "Προς Δήμο Γλυφάδας",
    date: "2025-12-05",
    status: "completed",
  },
  {
    id: "6",
    action: "Λήψη Φορτηγού",
    municipality: "Από Δήμο Αμαρουσίου",
    date: "2025-12-04",
    status: "completed",
  },
];

export function TransactionsView() {
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: "pdf" | "excel") => {
    if (format === "pdf") {
      // Dynamic import for jsPDF
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      // Add title
      pdf.setFontSize(18);
      pdf.text("Ιστορικό Συναλλαγών", 14, 20);

      // Add date
      pdf.setFontSize(10);
      pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString("el-GR")}`, 14, 30);

      // Add transactions
      pdf.setFontSize(12);
      pdf.text(`Πρόσφατες Συναλλαγές (${recentActions.length}):`, 14, 45);

      let yPos = 55;
      recentActions.forEach((action, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${action.action}`, 14, yPos);
        pdf.text(`   ${action.municipality}`, 14, yPos + 5);
        pdf.text(
          `   Ημερομηνία: ${new Date(action.date).toLocaleDateString("el-GR")}`,
          14,
          yPos + 10
        );
        pdf.text(`   Κατάσταση: Ολοκληρώθηκε`, 14, yPos + 15);
        yPos += 25;
      });

      pdf.save("synallages.pdf");
    } else {
      // Dynamic import for XLSX
      const XLSX = await import("xlsx");
      // Excel export
      const ws = XLSX.utils.json_to_sheet(
        recentActions.map((action) => ({
          Ενέργεια: action.action,
          Δήμος: action.municipality,
          Ημερομηνία: new Date(action.date).toLocaleDateString("el-GR"),
          Κατάσταση: "Ολοκληρώθηκε",
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Συναλλαγές");
      XLSX.writeFile(wb, "synallages.xlsx");
    }
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl text-white">Πρόσφατες Συναλλαγές</h2>
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

          {/* Report Content */}
          <div>
            <h4 className="text-lg text-white mb-4 font-semibold">
              Ιστορικό Ενεργειών Δήμου ({recentActions.length})
            </h4>
            <div className="space-y-3">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-white mb-1 font-medium">
                        {action.action}
                      </p>
                      <p className="text-sm text-gray-400">
                        {action.municipality}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">
                        {new Date(action.date).toLocaleDateString("el-GR")}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50 font-medium">
                        Ολοκληρώθηκε
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions List (when no report) */}
      {!showReport && (
        <>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl text-white mb-6">
              Ιστορικό Ενεργειών Δήμου
            </h3>
            <div className="space-y-3">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-white mb-1">{action.action}</p>
                      <p className="text-sm text-gray-400">
                        {action.municipality}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">
                        {new Date(action.date).toLocaleDateString("el-GR")}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50">
                        Ολοκληρώθηκε
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
            <p className="text-purple-300">
              Ως πολίτης, έχετε πρόσβαση σε δημόσια στατιστικά και πληροφορίες
              για τη διαχείριση των πόρων του δήμου σας. Αυτή η διαφάνεια
              προάγει την εμπιστοσύνη και την ενημέρωση της κοινότητας.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
