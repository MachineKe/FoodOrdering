import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuth } from './providers/AuthProvider';
const index = () => {

  const { session, loading, isAdmin } = useAuth()


  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />
  }

  return <Redirect href="/(admin)" />
};

export default index;