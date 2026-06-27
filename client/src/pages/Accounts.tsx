import { useState, type FC } from "react";

// components
import List from "@components/common/List";
import { AddButton } from "@components/common/AddButton";
import { Searchbar } from "@components/common/Searchbar";
import { DeleteButton } from "@components/common/DeleteButton";
// utils
import { COMMON_BUTTON_CLASS } from "@utils/app.constant";
import Strings from "./nls/accounts_strings.json";
import CommonStrings from "@utils/nls/common_strings.json";

import { useStore } from "@store/useStore";
import { CreateAccount } from "@components/accounts/CreateAccount";

export const AccountList: FC = () => {
  const { accounts, createAccount, loadAccounts } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const searchBarProps = {
    searchTerm,
    setSearchTerm: async (searchItem: string) => {
      setSearchTerm(searchItem);

      await loadAccounts(searchItem)
    },
    searchPlaceholder: Strings.searchPlaceholder,
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
        data={accounts}
        headers={[
          {
            key: "name",
            label: Strings.tableHeaders.name,
          },
          {
            key: "balance",
            label: Strings.tableHeaders.balance,
          },
          {
            key: "type",
            label: Strings.tableHeaders.type,
          },
        ]}
        renderActions={() => (
          <>
            <DeleteButton onClick={() => {
              alert('Account deletion disabled')
              //removeAccount(row.id)
            }} />
          </>
        )}
      />

      {openCreateModal && (
        <CreateAccount
          setIsModalOpen={setOpenCreateModal}
          addAccount={createAccount}
          accounts={accounts}
        />
      )}
    </div>
  );
};
