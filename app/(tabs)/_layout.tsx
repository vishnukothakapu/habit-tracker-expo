import { Tabs } from 'expo-router';
import { Home, Plus, User } from "lucide-react-native";
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 80,
        },
        tabBarActiveTintColor: '#4e55e0',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <View style={{ marginTop: 10 }}>
              <Home size={30} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          tabBarIcon: ({ size }) => (
            <View
              style={{
                backgroundColor: '#4e55e0',
                padding: 18,
                borderRadius: 40,
                marginTop: -20,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
              <Plus size={30} color="#ffffff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <View style={{ marginTop: 10 }}>
              
              <User size={30} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
