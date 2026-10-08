import { Text } from 'react-native';
import { C } from './theme';
import { shared } from './styles';
import WorksCarousel from './WorksCarousel';

export default function WorksSection({ works }) {
  return (
    <>
      <Text
        style={[
          shared.secTitle,
          { paddingHorizontal: 20, marginTop: 22, marginBottom: 14 },
        ]}
      >
        Ishlari
      </Text>
      {works.length > 0 ? (
        <WorksCarousel works={works} />
      ) : (
        <Text style={{ fontSize: 12.5, color: C.dim, paddingHorizontal: 20 }}>
          Bu yo'nalish bo'yicha ishlar hali qo'shilmagan
        </Text>
      )}
    </>
  );
}
