import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import images from "@/constants/images"; // Make sure onboarding image matches the one in screenshot

const Welcome = () => {
    const router = useRouter();

    const handleLogin = () => {
        router.replace("/signup");
    };

    const handleExistingAccount = () => {
        router.push("/login"); // or your login page route
    };

    return (
        <SafeAreaView className="flex-1 bg-[#4e55e0]">
            <ScrollView contentContainerClassName="flex-1 items-center justify-center px-6 py-10">

                {/* Welcome Text */}
                <View className="mt-10">
                    <Text className="text-white text-5xl font-[Inter-Bold] text-center leading-tight">
                        Build healthy{'\n'}habits with us
                    </Text>
                </View>

                {/* Image */}
                <Image
                    source={images.onboarding}
                    className="w-full h-[500px]"
                    resizeMode="contain"
                />

                {/* Buttons */}
                <View className="w-full space-y-4 mb-10">
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-white py-4 rounded-xl shadow-md shadow-black/30"
                    >
                        <Text className="text-black text-center text-lg font-[Inter-Bold]">Get started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleExistingAccount} className="mt-4">
                        <Text className="text-white text-center text-base underline font-[Inter-Medium]">
                            I have an account
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Welcome;
