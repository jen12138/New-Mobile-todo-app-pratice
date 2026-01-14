import { Pressable, StyleSheet, Text, View } from "react-native";

import type { FilterValue } from "../types";

type FilterTabsProps = {
  filter: FilterValue;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  onChange: (nextFilter: FilterValue) => void;
};

const tabs: Array<{
  label: string;
  value: FilterValue;
  countKey: keyof FilterTabsProps["counts"];
}> = [
  { label: "All", value: "all", countKey: "all" },
  { label: "Active", value: "active", countKey: "active" },
  { label: "Completed", value: "completed", countKey: "completed" },
];

export function FilterTabs({ filter, counts, onChange }: FilterTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = filter === tab.value;
        return (
          <Pressable
            key={tab.value}
            style={[styles.button, isActive && styles.buttonActive]}
            onPress={() => onChange(tab.value)}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {`${tab.label} (${counts[tab.countKey]})`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderColor: "#dcdfe6",
    borderWidth: 1,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#247bff",
    borderColor: "#247bff",
  },
  text: {
    fontSize: 14,
    color: "#5c5c5c",
    fontWeight: "600",
  },
  textActive: {
    color: "#fff",
  },
});
