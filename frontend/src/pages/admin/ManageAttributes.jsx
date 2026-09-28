import { useEffect, useState } from "react";

import ManageAttributesLayout from "../../components/admin/ManageAttributesLayout";
import AttributeModal from "../../components/admin/AttributeModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import SuccessModal from "../../components/admin/SuccessModal";

import {
  getColours,
  getCategories,
  createColour,
  getItemsColorCategory,
  updateItemColorCategory,
  updateColour,
  deleteColour,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

const ManageAttributes = () => {
  const [colours, setColours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("colour");
  const [editingItem, setEditingItem] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);

      const [coloursData, categoriesData, itemsData] = await Promise.all([
        getColours(),
        getCategories(),
        getItemsColorCategory(),
      ]);

      setColours(coloursData);
      setCategories(categoriesData);
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to load attributes:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     OPEN ADD MODAL
  ========================================================= */

  const handleAdd = (type) => {
    setEditingItem(null);

    if (type === "colours") {
      setModalType("colour");
    }

    if (type === "categories") {
      setModalType("category");
    }

    setModalOpen(true);
  };

  /* =========================================================
     OPEN EDIT MODAL
  ========================================================= */

  const handleEdit = (type, item) => {
    setEditingItem(item);

    if (type === "colours") {
      setModalType("colour");
    }

    if (type === "categories") {
      setModalType("category");
    }

    setModalOpen(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async (formData) => {
    try {
      /* =========================
         COLOUR
      ========================= */

      if (modalType === "colour") {
        if (editingItem) {
          const updated = await updateColour(editingItem.id, formData);

          setColours((previous) =>
            previous.map((colour) =>
              colour.id === editingItem.id ? updated : colour,
            ),
          );
        } else {
          const created = await createColour(formData);

          setColours((previous) => [...previous, created]);
        }
      }

      /* =========================
         CATEGORY
      ========================= */

      if (modalType === "category") {
        if (editingItem) {
          const updated = await updateCategory(editingItem.id, formData);

          setCategories((previous) =>
            previous.map((category) =>
              category.id === editingItem.id ? updated : category,
            ),
          );
        } else {
          const created = await createCategory(formData);

          setCategories((previous) => [...previous, created]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save attribute:", error);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (type, item) => {
    setDeleteType(type);
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

 const handleConfirmDelete = async (item) => {
   try {
     if (deleteType === "categories") {
       const affectedItems = items.filter(
         (currentItem) =>
           currentItem.category?.toLowerCase() === item.name?.toLowerCase(),
       );

       // Reassign affected items to Other
       for (const currentItem of affectedItems) {
         await updateItemColorCategory(currentItem.id, {
           ...currentItem,
           category: "Other",
         });
       }

       // Delete category
       await deleteCategory(item.id);

       // Update local items
       setItems((previous) =>
         previous.map((currentItem) =>
           currentItem.category?.toLowerCase() === item.name?.toLowerCase()
             ? {
                 ...currentItem,
                 category: "Other",
               }
             : currentItem,
         ),
       );

       // Remove deleted category
       setCategories((previous) =>
         previous.filter((category) => category.id !== item.id),
       );
     }

     if (deleteType === "colours") {
       const affectedItems = items.filter(
         (currentItem) =>
           currentItem.color?.toLowerCase() === item.name?.toLowerCase(),
       );

       // Reassign affected items to Other
       for (const currentItem of affectedItems) {
         await updateItemColorCategory(currentItem.id, {
           ...currentItem,
           color: "Other",
         });
       }

       // Delete colour
       await deleteColour(item.id);

       // Update local items
       setItems((previous) =>
         previous.map((currentItem) =>
           currentItem.color?.toLowerCase() === item.name?.toLowerCase()
             ? {
                 ...currentItem,
                 color: "Other",
               }
             : currentItem,
         ),
       );

       // Remove deleted colour
       setColours((previous) =>
         previous.filter((colour) => colour.id !== item.id),
       );
     }

     // IMPORTANT:
     // Close delete confirmation only
     setDeleteModalOpen(false);
     setDeleteItem(null);
     setDeleteType(null);

     // Show success modal
     setSuccessMessage(`Deleted '${item.name}' - items reassigned to others`);

     setSuccessModalOpen(true);
   } catch (error) {
     console.error("Delete failed:", error);
   }
 };

  const coloursWithCount = colours.map((colour) => ({
    ...colour,
    itemCount: items.filter(
      (item) => item.color?.toLowerCase() === colour.name?.toLowerCase(),
    ).length,
  }));

  console.log("coloursWithCount", coloursWithCount);

  const categoriesWithCount = categories.map((category) => ({
    ...category,
    itemCount: items.filter(
      (item) => item.category?.toLowerCase() === category.name?.toLowerCase(),
    ).length,
  })); 

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-body-md text-text-secondary">
          Loading attributes...
        </p>
      </div>
    );
  } 

  return (
    <>
      <ManageAttributesLayout
        title="Manage Attributes"
        description="Categories, locations, and colours used across the app"
        tabs={[
          {
            label: "Colours",
            value: "colours",
          },
          {
            label: "Categories",
            value: "categories",
          },
        ]}
        data={{
          colours: coloursWithCount,
          categories: categoriesWithCount,
        }}
        panelConfig={{
          colours: {
            title: "Colours",
            subtitle: "shown as a filter on Browse Items",
            showColor: true,
          showCategoryIcon: false,
          },

          categories: {
            title: "Categories",
            subtitle: "shown as a filter on Browse Items",
            showColor: false,
            showCategoryIcon: true,
          },
        }}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}

      <AttributeModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        type={modalType}
        editingItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        item={deleteItem}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteItem(null);
          setDeleteType(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onClose={() => {
          setSuccessModalOpen(false);
          setSuccessMessage("");
        }}
      />
    </>
  );
};

export default ManageAttributes;
