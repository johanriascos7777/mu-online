import { StatusBar } from 'expo-status-bar';
import './global.css'; 
import { Text, View } from 'react-native';

// Ahora solo importamos la Molécula, ella se encarga de llamar a los átomos
import { StatGroup } from './src/components/02-molecules/StatGroup';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-mu-bg-deep p-6">
      <Text className="text-3xl text-mu-gold font-cinzelBold mb-8 text-center">
        Continent of Legend
      </Text>

      {/* Insertamos la Molécula limpia y lista */}
      <StatGroup 
        characterClass="Dark Knight"
        hp={{ current: 390, max: 500 }}
        mp={{ current: 90, max: 200 }}
        exp={{ current: 62, max: 100 }}
      />

      <StatusBar style="light" />
    </View>
  );
}