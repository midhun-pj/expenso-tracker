import { useStore } from '@store/useStore';
import { SettingsForm } from '@components/configuration/SettingsForm';
import { CategoryForm } from '@components/categories/CategoryForm';

export const Settings: React.FC = () => {
  const {
    categories,
    addCategory,
    removeCategory,
    currency,
    theme,
    setConfig,
    setTheme,
  } = useStore();

  return (
    <>
      <CategoryForm categories={categories} addCategory={addCategory} removeCategory={removeCategory} />

      <SettingsForm currency={currency} theme={theme} setConfig={setConfig} setTheme={setTheme} />

    </>
  );
};
