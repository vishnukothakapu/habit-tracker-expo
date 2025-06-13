import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                router.replace('/(tabs)');
            } else {
                router.replace('/welcome');
            }
        };
        checkAuth();
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-blue-50">
            <ActivityIndicator size="large" color="#4e55e0" className="mb-4" />
            <Text className="text-gray-700 text-lg">Loading user...</Text>
        </View>
    );
};

export default Index;
