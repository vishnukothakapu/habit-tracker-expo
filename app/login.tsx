import { View, Text, ScrollView, Image, TextInput, TouchableOpacity,Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from "lucide-react-native";
import icons from "@/constants/icons";
import {supabase} from '../lib/supabase';
const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
   const loginWithEmailAndPassword = async () => {
       const {error}  = await supabase.auth.signInWithPassword({email,password});
       if(error) Alert.alert("Login failed",error.message);
       else router.push('/(tabs)');
   }
    const handleGoogleLogin = () => {
        alert('Google Login!');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#4e55e0]">
            <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-10 space-y-10">

                {/* Header */}
                <View>
                    <Text className="text-white text-4xl font-[Inter-Bold] text-center leading-tight mb-4">
                        Welcome Back
                    </Text>
                    <Text className="text-white text-base text-center opacity-80">
                        Log in to track and build habits
                    </Text>
                </View>


                <View className="space-y-4 mt-8">
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#dbeafe"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        className="bg-white/10 text-white p-6 rounded-xl border border-transparent focus:border-[#b8eb6c] mb-3"
                    />
                    <View
                        className={`flex-row items-center px-4 rounded-xl ${
                            isPasswordFocused ? 'border border-[#b8eb6c]' : 'border border-transparent'
                        } bg-white/10`}
                    >
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#dbeafe"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className="flex-1 text-white pl-4 py-6"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <EyeOff color="white" size={24} />
                            ) : (
                                <Eye color="white" size={24} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    onPress={loginWithEmailAndPassword}
                    className="bg-[#b8eb6c] p-4 rounded-xl shadow-md shadow-black/30 mt-6"
                >
                    <Text className="text-center text-[#333] font-[Inter-Bold] text-lg">
                        Log In
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-gray-300" />
                    <Text className="mx-4 text-gray-200">OR</Text>
                    <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                {/* Google Login */}
                <TouchableOpacity
                    onPress={handleGoogleLogin}
                    className="bg-white py-5 rounded-2xl flex-row justify-center items-center shadow-md shadow-black/20"
                >
                    <Image source={icons.google} className="w-6 h-6 mr-3" resizeMode="contain" />
                    <Text className="text-black text-lg font-[Inter-SemiBold]">
                        Continue with Google
                    </Text>
                </TouchableOpacity>

                {/* Redirect to Signup */}
                <TouchableOpacity onPress={() => router.push('/signup')} className="mt-6">
                    <Text className="text-white underline text-center text-base">
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;
