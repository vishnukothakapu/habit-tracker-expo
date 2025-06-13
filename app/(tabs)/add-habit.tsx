import * as LucideIcons from 'lucide-react-native';
import React, { useState,useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {supabase} from "@/lib/supabase";

const iconOptions = [
  { name: 'Briefcase', color: '#FCD34D' },
  { name: 'Zap', color: '#F9A8D4' },
  { name: 'User', color: '#BFDBFE' },
  { name: 'Wallet', color: '#BBF7D0' },
  { name: 'ChefHat', color: '#FDBA74' },
  { name: 'Headphones', color: '#A5F3FC' },
  { name: 'Code', color: '#FDE68A' },
  { name: 'Book', color: '#F9A8D4' },
  { name: 'Home', color: '#BFDBFE' },
  { name: 'ShoppingBasket', color: '#BBF7D0' },
  { name: 'Flame', color: '#FCA5A5' },
  { name: 'Carrot', color: '#86EFAC' },
  { name: 'Keyboard', color: '#FDE68A' },
  { name: 'Image', color: '#FCD34D' },
  { name: 'Music', color: '#A5F3FC' },
  { name: 'Leaf', color: '#E9D5FF' },
];

const AddHabit = () => {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [interval, setInterval] = useState('Every day');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // const handleSubmit = () => {
  //   console.log({
  //     name: habitName,
  //     description,
  //     interval,
  //     icon: selectedIcon,
  //   });
  //   alert('Habit created!');
  // };
  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const { error } = await supabase.from('habits').insert([
        {
          user_id: user.id,
          name: habitName,
          description,
          interval,
          icon: selectedIcon,
          color: selectedColor,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Insert error:', error.message);
        Alert.alert('Error', 'Failed to add habit');
      } else {
        Alert.alert('Success', 'Habit Added!');
        // Reset form
        setHabitName('');
        setDescription('');
        setInterval('Daily');
        setSelectedIcon(null);
        setSelectedColor(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'Unexpected error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        className="bg-white"
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold mb-6 mt-10">Let's start a new habit</Text>

        <Text className="text-md mb-1">Name</Text>
        <TextInput
          placeholder="Type habit name"
          value={habitName}
          onChangeText={setHabitName}
          className="rounded-md px-3 py-4 mb-4 bg-gray-100"
        />

        <Text className="text-md mb-1">Description</Text>
        <TextInput
          placeholder="Describe a habit"
          value={description}
          onChangeText={setDescription}
          className="bg-gray-100 rounded-md px-3 py-4 mb-4"
        />

        <Text className="text-md mb-1">Interval</Text>
        <View className="bg-gray-100 rounded-md mb-4">
          <Picker
              selectedValue={interval}
              onValueChange={(itemValue) => setInterval(itemValue)}
              dropdownIconColor="gray"
              style={{ height: 60 }}
          >
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Weekly" value="Weekly" />
            <Picker.Item label="Monthly" value="Monthly" />
          </Picker>
        </View>


        <Text className="text-md mb-2">Icon</Text>
        <View className="flex-row justify-start flex-wrap items-center gap-2.5 mb-6">
          {iconOptions.map((item, idx) => {
            const IconComponent = LucideIcons[item.name];
            return (
              <TouchableOpacity
                key={idx}
                onPress={() =>
                {
                  setSelectedIcon(item.name);
                  setSelectedColor(item.color)
                }
              }
                style={{
                  backgroundColor:
                    selectedIcon === item.name ? '#3B82F6' : item.color,
                }}
                className="w-24 h-24 rounded-xl items-center justify-center"
              >
                {IconComponent && (
                  <IconComponent
                    size={30}
                    color={selectedIcon === item.name ? 'white' : 'black'}
                    strokeWidth={2.5}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className="bg-[#4e55e0] px-2 py-4 rounded-lg mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold text-md">Add Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddHabit;
