import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  

  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#5c5c5c",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#5c5c5c",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#247bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

});

export default styles;


