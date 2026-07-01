import { useState, type FC } from "react";

// components
import List from "@components/common/List";
import { AddButton } from "@components/common/AddButton";
import { Searchbar } from "@components/common/Searchbar";
import { CreateProduct } from "@components/grocery/CreateProduct";
import { DeleteButton } from "@components/common/DeleteButton";
import { EditButton } from "@components/common/EditButton";
// utils
import {
  COMMON_BUTTON_CLASS,
  DEFAULT_FILTER_PARAMS,
} from "@utils/app.constant";
import Strings from "./nls/product_strings.json";
import CommonStrings from "@utils/nls/common_strings.json";

import { useStore } from "@store/useStore";
import type { Product } from "@models/product.model";

export const ProductList: FC = () => {
  const { products, addProduct, updateProduct, removeProduct, getProducts } =
    useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);

  const searchBarProps = {
    searchTerm,
    setSearchTerm: (searchItem: string) => {
      setSearchTerm(searchItem);

      searchProducts(searchItem);
    },
    searchPlaceholder: Strings.searchPlaceholder,
  };

  const searchProducts = async (search: string) => {
    setLoading(true);

    await getProducts(
      {
        ...DEFAULT_FILTER_PARAMS,
        search,
      },
      false,
    );
    setLoading(false);
  };

  const loadMoreProducts = async () => {
    setLoading(true);
    await getProducts(
      {
        ...DEFAULT_FILTER_PARAMS,
        page: (products?.pagination?.page || 0) + 1,
        search: searchTerm || "",
      },
      true,
    );
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Searchbar {...searchBarProps} />
        <AddButton
          buttonClasses={COMMON_BUTTON_CLASS}
          onClick={() => setOpenCreateModal(true)}
          label={CommonStrings.create}
          mobileLabel={CommonStrings.create}
        />
      </div>

      <List
        data={products?.data || []}
        headers={[
          {
            key: "name",
            label: Strings.tableHeaders.name,
          },
          {
            key: "brandName",
            label: Strings.tableHeaders.brand,
          },
        ]}
        renderActions={(row) => (
          <>
            <EditButton
              onClick={() => {
                setEditingProduct(row);

                setOpenCreateModal(true);
              }}
            />
            <DeleteButton onClick={() => removeProduct(row.id)} />
          </>
        )}
      />

      {(products?.pagination?.totalPages || 0) >
        (products?.pagination?.page || 0) && (
        <button
          onClick={() => loadMoreProducts()}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors text-sm font-medium"
        >
          {CommonStrings.loadMore}
        </button>
      )}

      {openCreateModal && (
        <CreateProduct
          setIsModalOpen={setOpenCreateModal}
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};
