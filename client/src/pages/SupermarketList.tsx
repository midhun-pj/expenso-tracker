import { useState, type FC } from "react";

// components
import List from "@components/common/List";
import { AddButton } from "@components/common/AddButton";
import { Searchbar } from "@components/common/Searchbar";
import { DeleteButton } from "@components/common/DeleteButton";
import { EditButton } from "@components/common/EditButton";
// utils
import { COMMON_BUTTON_CLASS } from "@utils/app.constant";
import Strings from "./nls/supermarket_strings.json";
import CommonStrings from "@utils/nls/common_strings.json";

import { useStore } from "@store/useStore";
import type { Supermarket } from "@models/supermarket.model";
import { CreateSupermarket } from "@components/grocery/CreateSupermarket";

export const SupermarketList: FC = () => {
  const {
    superMarkets,
    addSupermarket,
    updateSupermarket,
    removeSupermarket,
    getSupermarkets,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingSupermarket, setEditingSupermarket] = useState<Supermarket>();

  const searchBarProps = {
    searchTerm,
    setSearchTerm: (searchItem: string) => {
      setSearchTerm(searchItem);

      searchSupermarkets(searchItem);
    },
    searchPlaceholder: Strings.searchPlaceholder,
  };

  const searchSupermarkets = async (search: string) => {
    await getSupermarkets(search);
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
        data={superMarkets}
        headers={[
          {
            key: "name",
            label: Strings.tableHeaders.name,
          },
          {
            key: "location",
            label: Strings.tableHeaders.location,
          },
        ]}
        renderActions={(row) => (
          <>
            <EditButton
              onClick={() => {
                setEditingSupermarket(row);

                setOpenCreateModal(true);
              }}
            />
            <DeleteButton onClick={() => removeSupermarket(row.id)} />
          </>
        )}
      />

      {openCreateModal && (
        <CreateSupermarket
          setIsModalOpen={setOpenCreateModal}
          addSupermarket={addSupermarket}
          updateSupermarket={updateSupermarket}
          editingSupermarket={editingSupermarket}
        />
      )}
    </div>
  );
};
