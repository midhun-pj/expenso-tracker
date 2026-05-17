import { useStore } from '@store/useStore';
import { SettingsForm } from '@components/configuration/SettingsForm';
import { CategoryForm } from '@components/categories/CategoryForm';
import { AccountsForm } from '@components/accounts/AccountsForm';

export const Settings: React.FC = () => {
  const {
    categories,
    addCategory,
    removeCategory,
    accounts,
    createAccount,
    removeAccount,
    currency,
    theme,
    setConfig,
    setTheme,
  } = useStore();

  return (
    <>
      <CategoryForm categories={categories} addCategory={addCategory} removeCategory={removeCategory} />

      <AccountsForm accounts={accounts} createAccount={createAccount} removeAccount={removeAccount} currency={currency} />

      <SettingsForm currency={currency} theme={theme} setConfig={setConfig} setTheme={setTheme} />

    </>
  );
};
