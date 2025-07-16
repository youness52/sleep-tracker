import { Tabs } from "expo-router";
import React from "react";
import { Feather } from '@expo/vector-icons'; // 👈 Import Feather
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.subtext,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
        },
        headerStyle: {
          backgroundColor: Colors.dark.background,
          
        },
        headerTitleStyle: {
          color: Colors.dark.text,
        
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
           headerShown: false,
          title: "Sleep",
          tabBarIcon: ({ color }) => (
            <Feather name="moon" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
           headerShown: false,
          title: "History",
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
           headerShown: false,
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart-2" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
