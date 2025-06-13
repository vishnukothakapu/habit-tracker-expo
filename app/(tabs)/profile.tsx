import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const Profile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                Alert.alert('Error fetching user', error.message);
                router.replace('/welcome');
            } else {
                setUserData(data.user);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Logout Error', error.message);
        } else {
            router.replace('/welcome');
        }
    };

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4e55e0" />
                <Text style={styles.loadingText}>Loading user...</Text>
            </View>
        );
    }

    const name = userData.user_metadata?.name || 'User';
    const firstLetter = name.charAt(0).toUpperCase();
    const email = userData.email;
    const joinedDate = new Date(userData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Profile</Text>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{firstLetter}</Text>
                </View>
            </View>

            {/* Name */}
            <View style={styles.block}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.valueText}>{name}</Text>
                </View>
            </View>

            {/* Email */}
            <View style={styles.block}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.valueText}>{email}</Text>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Joined Date */}
            <View style={styles.joinedContainer}>
                <Text style={styles.label}>Joined on</Text>
                <Text style={styles.joinedText}>{joinedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#374151',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop:30,
    },
    avatarWrapper: {
        alignItems: 'center',
        marginTop: 32,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#9CA3AF', // gray-400
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
    },
    block: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginTop: 10,
    },
    valueBox: {
        backgroundColor: '#E5E7EB', // gray-200
        padding: 12,
        marginTop:10,
        borderRadius: 10,
    },
    valueText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    joinedContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    joinedText: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '600',
        marginTop: 4,
    },
});

export default Profile;
