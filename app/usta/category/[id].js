import { Redirect, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { useUstaData } from '../../../src/context/UstaDataContext';
import { useGoBack } from '../../../src/hooks/useGoBack';
import CategoryDetailScreen from '../../../src/screens/CategoryDetailScreen';
import { MY_WORKS } from '../../../src/screens/usta-main/data';

export default function Category() {
  const router = useRouter();
  const goBack = useGoBack('/usta');
  const { theme: t } = useTheme();
  const { categories, updateCategory } = useUstaData();
  const { id } = useLocalSearchParams();
  const category = categories.find((c) => String(c.id) === id);

  if (!category) return <Redirect href="/usta" />;

  return (
    <CategoryDetailScreen
      category={category}
      works={MY_WORKS.filter((w) => w.category === category.name)}
      t={t}
      onBack={goBack}
      onSelectWork={(w) => router.push(`/usta/work/${w.id}`)}
      onUpdate={(updates) => updateCategory(category.id, updates)}
    />
  );
}
