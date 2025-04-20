import { create } from "zustand";
import useAuthStore from "@/store/authStore";
import { receiptApi } from "@/services/api";
import { cleanReceiptForBackend } from "@/lib/cleanReceiptForBackend";
import { compressImage, hashFile } from "@/lib/images";

const useReceiptStore = create((set, get) => ({
  receipts: [],
  pendingReceipts: [],
  empty_receipt: {
    id: "",
    filename: "",
    blob_url: "",
    summary: "",
    parsed: {
      merchant: "",
      date_time: "",
      items: [
        {
          name: "",
          unit_price: 0,
          quantite: 1,
          price: null,
          category: "",
        },
      ],
      taxes: 0,
      total: 0,
      currency: "CAD",
    },
    parser: "",
    success: false,
  },
  totalCount: 0,
  currentPage: 1,
  limit: 5,
  getEmptyItem: () => get().empty_receipt.parsed.items[0],
  getEmptyReceipt: () => get().empty_receipt,

  mapServerReceiptToPending: (serverReceipt) => {
    const { empty_receipt } = get();
    return {
      ...empty_receipt,
      ...serverReceipt,
      parsed: {
        ...empty_receipt.parsed,
        ...serverReceipt.parsed,
        items: (serverReceipt.parsed?.items || []).map((item) => ({
          ...empty_receipt.parsed.items[0],
          ...item,
        })),
      },
    };
  },

  uploadReceipt: async (file) => {
    try {
      const compressed = await compressImage(file);
      const hash = await hashFile(compressed);

      const checkRes = await receiptApi.post("/receipts/image/check", {
        original_signature: hash,
      });

      if (checkRes.data.exists) {
        console.warn("⚠️ Reçu déjà existant :", checkRes.data);
        return { exists: true, ...checkRes.data };
      }

      const formData = new FormData();
      formData.append("files", compressed);

      const res = await receiptApi.post("/receipts/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("📤 Réponse serveur upload:", res.data);

      const results = res.data.results || [];

      const newPending = results
        .filter((r) => r.parsed)
        .map((r) => get().mapServerReceiptToPending({
          ...r,
          original_signature: hash,
        }));

      set((state) => ({
        pendingReceipts: [...state.pendingReceipts, ...newPending],
      }));

      return results;
    } catch (err) {
      console.error("❌ Erreur lors de l'upload :", err);
      throw err;
    }
  },

  getReceipts: async (page = 1, limit = 5) => {
    try {
      const res = await receiptApi.get(`/receipts?page=${page}&limit=${limit}`);
      const { receipts: rawReceipts, totalCount } = res.data;
      const userId = useAuthStore.getState().user?.id || "";

      const receipts = rawReceipts.map((r) => ({
        id: r.id,
        blob_url: r.blob_url,
        summary: r.summary,
        parsed: r,
        user_id: userId,
        editable: {
          merchant: r.merchant || "",
          date: r.date_time?.substring(0, 10) || "",
          total: r.total || 0,
          items:
            r.items?.map((item) => ({
              name: item.name || "",
              unit_price: item.unit_price || 0,
              quantite: item.quantite || 1,
              price:
                item.price || (item.unit_price || 0) * (item.quantite || 1),
              category: item.category || "",
            })) || [],
        },
      }));

      set({ receipts, totalCount, currentPage: page, limit });
    } catch (err) {
      console.error("❌ Erreur fetch reçus :", err);
    }
  },

  addPendingReceipts: (receipts) =>
    set((state) => ({
      pendingReceipts: [...state.pendingReceipts, ...receipts],
    })),

  removePendingReceipt: (index) =>
    set((state) => ({
      pendingReceipts: state.pendingReceipts.filter((_, i) => i !== index),
    })),

  clearPendingReceipts: () => set({ pendingReceipts: [] }),

  addReceipts: (newReceipts) =>
    set((state) => ({
      receipts: [
        ...state.receipts,
        ...newReceipts.map((r) => ({
          id: r.filename,
          blob_url: r.blob_url,
          summary: r.summary,
          parsed: r.parsed,
          user_id: useAuthStore.getState().user?.id || "",
          editable: {
            merchant: r.parsed?.merchant_name || "",
            date: r.parsed?.date_time || "",
            total: r.parsed?.total || "",
            items:
              r.parsed?.items?.map((item) => ({
                name: item.name || "",
                unit_price: item.unit_price || 0,
                quantite: item.quantite || 1,
                price:
                  item.price || (item.unit_price || 0) * (item.quantite || 1),
                category: item.category || "",
              })) || [],
          },
        })),
      ],
    })),

  updateReceipt: (id, field, value) =>
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === id ? { ...r, editable: { ...r.editable, [field]: value } } : r
      ),
    })),

  updateItem: (id, index, field, value) =>
    set((state) => ({
      receipts: state.receipts.map((r) => {
        if (r.id !== id) return r;
        const newItems = [...r.editable.items];
        newItems[index][field] = value;
        if (field === "unit_price" || field === "quantite") {
          const price = parseFloat(
            field === "unit_price" ? value : newItems[index].unit_price || 0
          );
          const quantite = parseFloat(
            field === "quantite" ? value : newItems[index].quantite || 1
          );
          newItems[index].price = parseFloat((price * quantite).toFixed(2));
        }
        return { ...r, editable: { ...r.editable, items: newItems } };
      }),
    })),

  removeReceipt: (id) =>
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
    })),

  addEmptyReceipt: () => {
    const id = `manuel_${Date.now()}`;
    const userId = useAuthStore.getState().user?.id || "";
    const newReceipt = {
      id,
      blob_url: "",
      summary: "Saisie manuelle",
      parsed: {},
      user_id: userId,
      editable: {
        merchant: "",
        date: "",
        total: "",
        items: [
          { name: "", unit_price: 0, quantite: 1, price: 0, category: "" },
        ],
      },
    };
    set((state) => ({
      receipts: [...state.receipts, newReceipt],
    }));
  },

  saveReceiptToBackend: async (id) => {
    const state = get();
    const receipt = state.receipts.find((r) => r.id === id);
    if (!receipt) {
      console.error("❌ Reçu introuvable :", id);
      return;
    }
    try {
      const cleaned = cleanReceiptForBackend(receipt.editable);
      const res = await receiptApi.put(`/receipts/${id}`, cleaned);
      set((state) => ({
        receipts: state.receipts.map((r) =>
          r.id === id
            ? {
                ...r,
                parsed: res.data,
                editable: {
                  merchant: res.data.merchant,
                  date: res.data.date_time?.substring(0, 10) || "",
                  total: res.data.total || 0,
                  items:
                    res.data.items?.map((item) => ({
                      name: item.name || "",
                      unit_price: item.unit_price || 0,
                      quantite: item.quantite || 1,
                      price:
                        item.price ||
                        (item.unit_price || 0) * (item.quantite || 1),
                      category: item.category || "",
                    })) || [],
                },
              }
            : r
        ),
      }));
    } catch (err) {
      console.error("❌ Erreur mise à jour backend :", err);
      throw err;
    }
  },

  resetReceipts: () => set({ receipts: [] }),
}));

export default useReceiptStore;
