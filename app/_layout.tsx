import React from 'react';
import { Stack } from 'expo-router';
import { DiaryProvider } from '../src/context/DiaryContext';
export default function RootLayout() {
return (
<DiaryProvider>
<Stack>Mobile Programming • React Native + Expo CLI • Pertemuan 6
<Stack.Screen
name="(tabs)"
options={{
headerShown: false,
}}
/>
<Stack.Screen
name="detail/[id]"
options={{
title: 'Detail Diary',
}}
/>
</Stack>
</DiaryProvider>
);
}