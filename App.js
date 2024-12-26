import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./components/task";

export default function App() {
  const [task, setTask] = useState();
  const [taskList, setTaskList] = useState([]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTaskList(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log("Error loading tasks:", error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.log("Error saving tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(taskList);
  }, [taskList]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskList([...taskList, task]);
    setTask(null);
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskList];
    itemsCopy.splice(index, 1);
    setTaskList(itemsCopy);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Today's Task */}
        <View style={styles.taskwrapper}>
          <Text style={styles.title}>Today's Task</Text>

          {/* ScrollView for tasks */}
          <ScrollView style={styles.scrollView}>
            <View style={styles.items}>
              {taskList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => completeTask(index)}
                >
                  <Task text={item} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Line above the input */}
        <View style={styles.line} />

        {/* Write Task */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={"Add a task"}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    paddingTop: 45,
  },
  taskwrapper: {
    paddingTop: 15,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  items: {
    marginBottom: 20,
    marginRight: 5,
  },
  line: {
    height: 1,
    backgroundColor: "#C0C0C0",
    width: "100%",
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#C0C0C0",
    paddingVertical: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 20,
    elevation: 10,
  },
  input: {
    paddingVertical: 19,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "lightblue",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
  },
  addText: {
    color: "#fff",
    fontSize: 24,
  },
});
