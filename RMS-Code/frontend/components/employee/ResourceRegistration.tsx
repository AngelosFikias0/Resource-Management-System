import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";
import { useRef, useState } from "react";

// Configuration - can be moved to separate config file
const CATEGORIES = [
  "Μηχανήματα",
  "Οχήματα",
  "Εξοπλισμός",
  "Εργαλεία",
  "Υλικά Κατασκευών",
  "Άλλο",
] as const;

const UNITS = ["Τεμάχια", "Κιλά", "Μέτρα", "Λίτρα", "Τόνοι"] as const;

interface FormData {
  name: string;
  quantity: string;
  category: string;
  description: string;
  unit: string;
}

const INITIAL_FORM_STATE: FormData = {
  name: "",
  quantity: "",
  category: "",
  description: "",
  unit: "",
};

export function ResourceRegistration() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Το όνομα του πόρου είναι υποχρεωτικό";
    }
    if (!formData.category) {
      return "Η κατηγορία είναι υποχρεωτική";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      return "Η ποσότητα πρέπει να είναι τουλάχιστον 1";
    }
    if (!formData.unit) {
      return "Η μονάδα μέτρησης είναι υποχρεωτική";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // await saveResource(formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving resource:", formData);

      // Success
      setShowSuccess(true);
      setFormData(INITIAL_FORM_STATE);
      formRef.current?.reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Σφάλμα κατά την αποθήκευση"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setError(null);
    setShowSuccess(false);
    formRef.current?.reset();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Καταγραφή Πόρων</h2>
        <p className="text-gray-400">
          Καταχωρήστε νέους πόρους στο σύστημα διαχείρισης
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div
          className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-start gap-3"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-semibold">Επιτυχής Καταγραφή!</p>
            <p className="text-sm text-green-300 mt-1">
              Ο πόρος καταχωρήθηκε επιτυχώς στο σύστημα.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold">Σφάλμα</p>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-white/20">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-300 mb-2 font-medium"
              >
                Όνομα Πόρου <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="π.χ. Εκσκαφέας Κοματσού"
                autoComplete="off"
              />
            </div>

            {/* Category Select */}
            <div>
              <label
                htmlFor="category"
                className="block text-gray-300 mb-2 font-medium"
              >
                Κατηγορία <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-800 text-gray-400">
                  Επιλέξτε κατηγορία
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

            {/* Quantity Input */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-gray-300 mb-2 font-medium"
              >
                Ποσότητα <span className="text-red-400">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                required
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="π.χ. 5"
              />
            </div>

            {/* Unit Select */}
            <div>
              <label
                htmlFor="unit"
                className="block text-gray-300 mb-2 font-medium"
              >
                Μονάδα Μέτρησης <span className="text-red-400">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                required
                value={formData.unit}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-800 text-gray-400">
                  Επιλέξτε μονάδα
                </option>
                {UNITS.map((unit) => (
                  <option
                    key={unit}
                    value={unit}
                    className="bg-slate-800 text-white"
                  >
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 mb-2 font-medium"
            >
              Περιγραφή
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Προσθέστε λεπτομέρειες για τον πόρο..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              Καθαρισμός
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-cyan-500"
            >
              {isSubmitting ? (
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
        </form>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-400">
        <p>* Τα πεδία με αστερίσκο είναι υποχρεωτικά</p>
      </div>
    </div>
  );
}
