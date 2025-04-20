import useAuthStore from "@/store/authStore";

export function cleanReceiptForBackend(editable) {
  const { user } = useAuthStore.getState();
  const { merchant, date, total, items } = editable;

  // 1. Validation des champs obligatoires (comme dans ReceiptUpdateModel)
  if (!merchant || !date || isNaN(parseFloat(total))) {
    throw new Error("Merchant, Date et Total sont obligatoires");
  }

  // 2. Conversion des données pour le backend
  return {
    user_id: String(user?.id || ""), // Fallback explicite
    merchant: merchant.trim(), // Nettoyage des espaces
    date_time: new Date(date).toISOString(), // Conversion en ISO8601
    total: parseFloat(total),
    reviewed_and_corrected: true, // Force la validation humaine
    items: items.map((item) => {
      const unit = parseFloat(item.unit_price || 0);
      const qty = parseFloat(item.quantite || 1);
      const price = item.price !== undefined 
        ? parseFloat(item.price) 
        : parseFloat((unit * qty).toFixed(2)); // Fallback calculé

      return {
        name: item.name?.trim() || "Article sans nom", // Fallback backend-compatible
        unit_price: unit,
        quantite: qty,
        price: price, 
        category: item.category?.trim() || null, // Respecte le Optional[str]
      };
    }),
    // Champs optionnels du modèle (ajustables si nécessaires)
    currency: "CAD", // Default backend
    manual_entry: true, // Supposé vrai pour les reçus édités
  };
}