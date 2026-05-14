import { useStore } from '../store/useStore';
import { SettingsForm } from '../components/configuration/SettingsForm';
import { CategoryForm } from '../components/categories/CategoryForm';
import { AccountsForm } from '../components/accounts/AccountsForm';

export const Settings: React.FC = () => {
  const {
    categories,
    addCategory,
    removeCategory,
    accounts,
    createAccount,
    deleteAccount,
    supermarkets,
    addSupermarket,
    removeSupermarket,
    currency,
    theme,
    setConfig,
    setTheme,
  } = useStore();

  return (
    <>
      <CategoryForm
        categories={categories}
        addCategory={addCategory}
        removeCategory={removeCategory}
      />

      <AccountsForm
        accounts={accounts}
        createAccount={createAccount}
        deleteAccount={deleteAccount}
        currency={currency}
      />

      <SettingsForm
        supermarkets={supermarkets}
        addSupermarket={addSupermarket}
        removeSupermarket={removeSupermarket}
        currency={currency}
        theme={theme}
        setConfig={setConfig}
        setTheme={setTheme}
      />

    </>
  );
};
