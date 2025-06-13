import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BellIcon,
  CircleCheck,
  Circle,
  Smile,
  Calendar as CalendarIcon,
  Pencil,
} from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }
  return days;
};

const Index = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].fullDate);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [streaks, setStreaks] = useState({});

  const days = getNext7Days();
  const todayStr = days[0].fullDate;
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        Alert.alert('Error fetching user', error?.message);
        router.replace('/welcome');
      } else {
        setUserData(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) fetchHabitsForDate(selectedDate);
  }, [userData, selectedDate]);

  const fetchHabitsForDate = async (dateStr) => {
    const { data: allHabits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userData.id);

    const dateObj = new Date(dateStr);
    const filtered = allHabits.filter((habit) => {
      const created = new Date(habit.created_at);
      if (habit.interval === 'Daily') return true;
      if (habit.interval === 'Weekly') return created.getDay() === dateObj.getDay();
      if (habit.interval === 'Monthly') return created.getDate() === dateObj.getDate();
      return false;
    });

    const { data: completionsData } = await supabase
        .from('habit_completions')
        .select('habit_id, done, date')
        .eq('user_id', userData.id);

    const completionMap = {};
    const streakMap = {};

    completionsData?.forEach((c) => {
      const cDate = new Date(c.date).toISOString().split('T')[0];
      if (cDate === dateStr) {
        completionMap[c.habit_id] = c.done;
      }
      if (c.done) {
        streakMap[c.habit_id] = (streakMap[c.habit_id] || 0) + 1;
      }
    });

    setHabits(filtered);
    setCompletions(completionMap);
    setStreaks(streakMap);
  };

  const toggleHabitDone = async (habitId, newValue) => {
    if (selectedDate !== todayStr) return;

    const { error } = await supabase.from('habit_completions').upsert(
        {
          habit_id: habitId,
          user_id: userData.id,
          date: selectedDate,
          done: newValue,
        },
        {
          onConflict: ['habit_id', 'user_id', 'date'],
          ignoreDuplicates: false,
        }
    );

    if (!error) {
      setCompletions((prev) => ({ ...prev, [habitId]: newValue }));
      Toast.show({
        type: 'success',
        text1: newValue ? 'Marked as completed 🎉' : 'Marked as incomplete',
        position: 'bottom',
      });
    } else {
      console.log('Toggle Error', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 16) return 'Good Afternoon';
    return 'Good Evening';
  };

  const totalCompleted = Object.values(completions).filter((v) => v).length;

  if (loading || !userData) {
    return (
        <View className="flex-1 justify-center items-center bg-blue-50">
          <ActivityIndicator size="large" color="#4e55e0" />
        </View>
    );
  }

  return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-6 pt-10 ">
          <View>
            <Text className="text-3xl text-black font-semibold">{getGreeting()},</Text>
            <Text className="text-5xl font-semibold">
              {userData.user_metadata?.name?.split(' ')[0] || 'User'}
            </Text>
          </View>
          <View className="bg-gray-200 p-2 rounded-full">
            <BellIcon size={28} color="#333" />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-8 px-4">
          {days.map((day, index) => (
              <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedDayIndex(index);
                    setSelectedDate(day.fullDate);
                  }}
                  className={`mr-3 rounded-xl items-center justify-center ${
                      selectedDate === day.fullDate ? 'bg-black' : 'bg-gray-100'
                  }`}
                  style={{ width: 70, height: 80 }}
              >
                <Text
                    className={`text-md font-bold ${
                        selectedDate === day.fullDate ? 'text-white' : 'text-black'
                    }`}
                >
                  {day.date}
                </Text>
                <Text
                    className={`text-[16px] font-bold ${
                        selectedDate === day.fullDate ? 'text-white' : 'text-black'
                    }`}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
          ))}

          <TouchableOpacity
              onPress={() => setCalendarVisible(true)}
              className="rounded-xl bg-gray-200 items-center justify-center"
              style={{ width: 70, height: 80 }}
          >
            <CalendarIcon size={28} color="#000" />
          </TouchableOpacity>
        </ScrollView>

        <Text className="text-lg px-4 font-semibold mt-8">Completed Today: {totalCompleted}</Text>

        <ScrollView className="px-4 mt-4">
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {habits.map((habit, idx) => {
              const Icon = LucideIcons[habit.icon] || Smile;
              const completed = completions[habit.id] || false;

              return (
                  <View
                      key={idx}
                      className="w-[48%] p-4 rounded-xl relative overflow-hidden"
                      style={{ minHeight: 170, backgroundColor: habit.color || '#eee' }}
                  >
                    {completed && (
                        <View className="absolute left-0 right-0 bg-black px-2 z-10 py-3" style={{alignItems:"center",top:"60%",transform:[{translateY:-10}]}}>
                          <Text className="text-white text-xs font-bold">Done for Today 🎉</Text>
                        </View>
                    )}
                    <View className="flex-row justify-between mb-3">
                      <Icon size={28} color="#000" />
                      <TouchableOpacity
                          onPress={() => {
                            setEditHabit(habit);
                            setHabitName(habit.name);
                            setHabitDesc(habit.description);
                          }}
                      >
                        <Pencil size={20} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between items-center mt-4">
                      <View>
                        <Text className="text-base font-bold text-black">{habit.name}</Text>
                        <Text className="text-sm text-black">{habit.description}</Text>
                        <Text className="text-xs mt-1 text-black">Interval: {habit.interval}</Text>
                        <Text className="text-xs mt-1 text-black">Streak: {streaks[habit.id] || 0} 🔥</Text>
                      </View>

                      <TouchableOpacity
                          onPress={() => toggleHabitDone(habit.id, !completed)}
                          disabled={selectedDate !== todayStr}
                          style={{ position: 'absolute', bottom: 10, right: 10 }}
                      >
                        {completed ? (
                            <CircleCheck size={32} color="#10b981" />
                        ) : (
                            <Circle size={30} color={selectedDate === todayStr ? '#000' : '#aaa'} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Calendar Modal */}
        <Modal visible={calendarVisible} animationType="slide">
          <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-4">
              <Text className="text-2xl font-bold mb-4">Habit Calendar</Text>
              <Calendar
                  minDate={new Date().toISOString().split('T')[0]}
                  onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setSelectedDayIndex(days.findIndex((d) => d.fullDate === day.dateString));
                    fetchHabitsForDate(day.dateString);
                    setCalendarVisible(false);
                  }}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      marked: true,
                      selectedColor: '#4e55e0',
                    },
                  }}
              />
              <TouchableOpacity
                  onPress={() => setCalendarVisible(false)}
                  className="mt-6 bg-black p-3 rounded-xl"
              >
                <Text className="text-white text-center">Close Calendar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Edit Habit Modal */}
        <Modal visible={!!editHabit} animationType="slide" transparent>
          <SafeAreaView className="flex-1 bg-white p-6">
            <Text className="text-3xl font-bold mb-4 mt-6">Edit Habit</Text>
            <Text className="text-md mt-2">Title</Text>
            <TextInput
                value={habitName}
                onChangeText={setHabitName}
                placeholder="Habit name"
                className="bg-gray-200 focus:border border-[#4e55e0] px-3 py-4 rounded mb-2 mt-2"
            />
            <Text className="text-md mt-2">Description</Text>
            <TextInput
                value={habitDesc}
                onChangeText={setHabitDesc}
                placeholder="Description"
                className="bg-gray-200 focus:border border-[#4e55e0] px-3 py-4 rounded mb-3 mt-2"
            />
            <TouchableOpacity
                onPress={async () => {
                  await supabase
                      .from('habits')
                      .update({ name: habitName, description: habitDesc })
                      .eq('id', editHabit.id);
                  setEditHabit(null);
                  fetchHabitsForDate(selectedDate);
                }}
                className="bg-[#4e55e0] px-2 py-4 rounded-xl mt-2"
            >
              <Text className="text-white text-center text-md">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setEditHabit(null)}
                className="mt-3 p-3 rounded-xl border border-gray-300"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
  );
};

export default Index;
