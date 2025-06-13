import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View,Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AuthSession from "expo-auth-session";
import icons from "@/constants/icons";
// import {GoogleSignin,GoogleSigninButton,statusCodes} from "@react-native-google-signin/google-signin";
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({
    native:'smarthabit-tracker://auth',
    useProxy:true,
});
const Signup = () => {
    const router = useRouter();
    const [name,setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused,setIsPasswordFocused] = useState(false);
    // GoogleSignin.configure({
    //     scopes:["https://www.googleapis.com/auth/drive.readonly"],
    //     webClientId:process.env.GOOGLE_CLIENT_ID,
    // })
    const handleGoogleLogin = async () => {
        const {data,error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options:{
                redirectTo: redirectUri,
            },
        });
        if(error) {
            Alert.alert("Error", error.message);
        } else {
            const authUrl = data.url;
            const result = await AuthSession.startAsync({authUrl});
            if(result.type==='success') {
                await supabase.auth.exchangeCodeForSession(result.params);
                Alert.alert('Success','Logged in with Google!');
            }
        }
    };
    const signupWithEmail = async()=> {
        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
            },
        });
        if(error){Alert.alert('Signup error',error.message)
        } else{
            Alert.alert("User registered.Please login");
            router.push("/login")
        }
        }

    return (
        <SafeAreaView className="flex-1 bg-[#4e55e0]">
            <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-10 space-y-10">

                {/* Header */}
                <View>
                    <Text className="text-white text-4xl font-[Inter-Bold] text-center leading-tight mb-4">
                        Create your{'\n'}habit journey
                    </Text>
                    <Text className="text-white text-base text-center opacity-80">
                        Start tracking and building better habits today!
                    </Text>
                </View>

                {/* Form Fields */}
                <View className="space-y-4 mt-10">
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor="#dbeafe"
                        value={name}
                        onChangeText={setName}
                        className="bg-white/10 text-white p-6 rounded-xl mb-3 focus:border border-[#b8eb6c]"
                    />

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#dbeafe"
                        value={email}
                        onChangeText={setEmail}
                        className="bg-white/10 text-white p-6 rounded-xl mb-3 focus:border border-[#b8eb6c]"
                    />

                    {/* Password with toggle icon */}
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

                {/* Signup Button */}
                <TouchableOpacity
                    onPress={signupWithEmail}
                    className="bg-[#b8eb6c] p-4 rounded-xl shadow-md shadow-black/30 mt-6"
                >
                    <Text className="text-center text-[#333] font-[Inter-Bold] text-lg">
                        Sign Up
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
                    <Text className="text-black text-lg font-[Inter-SemiBold]">Sign up with Google</Text>
                </TouchableOpacity>


                {/*<GoogleSigninButton size={GoogleSigninButton.Size.Wide}*/}
               {/*                    color={GoogleSigninButton.Color.Light}*/}
               {/*                    onPress={async()=>*/}
               {/*                    {*/}
               {/*                        try {*/}
               {/*                            await GoogleSignin.hasPlayServices()*/}
               {/*                            const userInfo = await GoogleSignin.signIn()*/}
               {/*                            if(userInfo.data.idToken) {*/}
               {/*                                const {error,data} = await supabase.auth.signInWithIdToken({*/}
               {/*                                    provider:'google',*/}
               {/*                                    token:userInfo.data.idToken,*/}
               {/*                                })*/}
               {/*                                console.log(error,data)*/}

               {/*                            } else {*/}
               {/*                                throw new Error('no ID Token present!')*/}
               {/*                            }*/}
               {/*                        }*/}
               {/*                        catch (error:any) {*/}
               {/*                            if(error.code===statusCodes.SIGN_IN_CANCELLED){*/}

               {/*                        } else if (error.code === statusCodes.IN_PROGRESS) {*/}
               {/*                                // operation (e.g. sign in) is in progress already*/}
               {/*                            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {*/}
               {/*                                // play services not available or outdated*/}
               {/*                            } else {*/}
               {/*                                // some other error happened*/}
               {/*                            }*/}

               {/*}*/}
               {/*}}/>*/}

                {/* Already have an account */}
                <TouchableOpacity onPress={() => router.push('/login')} className="mt-6">
                    <Text className="text-white underline text-center text-base">
                        Already have an account? Login
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};
export default Signup