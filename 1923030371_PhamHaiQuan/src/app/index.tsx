// Khai báo thư viện cần dùng

import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

//Khai báo mã sinh viên, màu chủ đạo, độ bo tròn các góc, khoảng cách bên trong, mức độ ưu tiên và mức độ ưu tiên mặc định
const STUDENT_ID = "1923030371";

// Khai báo các mức độ ưu tiên của Todo.
type Priority = "Low" | "Medium" | "High";

// Khai báo kiểu dữ liệu cho một Todo.
type Todo = {
  // ID của Todo.
  id: string;

  // Nội dung công việc.
  text: string;

  // Trạng thái hoàn thành của Todo.
  completed: boolean;

  // Mức độ ưu tiên của Todo.
  priority: Priority;
};

// Khai báo kiểu dữ liệu cho các thuộc tính của TodoInput.
type TodoInputProps = {
  // Nhận hàm thêm Todo từ Component App.
  onAdd: (text: string, priority: Priority) => void;
};

// Khai báo kiểu dữ liệu cho các thuộc tính của TodoItem.
type TodoItemProps = {
  // Nhận một Todo từ Component App.
  item: Todo;

  // Nhận hàm hoàn thành Todo từ Component App.
  onToggle: (id: string) => void;

  // Nhận hàm xóa Todo từ Component App.
  onDelete: (id: string) => void;
};

const accentColors = ["#38BDF8", "#60A5FA", "#818CF8", "#A78BFA"];

// Lấy số đầu tiên của STUDENT_ID để chọn màu.
// parseInt(STUDENT_ID[0]) % accentColors.length là công thức tính vị trí màu.
const accentColor = accentColors[parseInt(STUDENT_ID[0]) % accentColors.length];

// Lấy số cuối của STUDENT_ID để tính độ bo tròn các góc.
// Công thức: lấy số cuối của STUDENT_ID rồi cộng thêm 8.
const borderRadius = parseInt(STUDENT_ID.slice(-1)) + 8;

// Lấy chữ số thứ 3 của STUDENT_ID để tính khoảng cách bên trong.
// Công thức: lấy chữ số thứ 3 của STUDENT_ID rồi cộng thêm 10.
const paddingValue = parseInt(STUDENT_ID[2]) + 10;

const priorityList: Priority[] = ["Low", "Medium", "High"];
// Lấy chữ số thứ 2 của STUDENT_ID để chọn mức độ ưu tiên mặc định.
// Công thức: lấy chữ số thứ 2 chia dư cho số lượng mức ưu tiên để tìm vị trí.
const defaultPriority =
  priorityList[parseInt(STUDENT_ID[1]) % priorityList.length];

// Component cho người dùng nhập công việc + chọn Priority + bấm thêm.
function TodoInput({ onAdd }: TodoInputProps) {
  // Khai báo text, setText để lưu nội dung người dùng nhập và thay đổi nội dung Text
  const [text, setText] = useState("");

  // Khai báo priority, setPriority để lưu mức độ ưu tiên đang chọn và thay đổi mức độ ưu tiên
  const [priority, setPriority] = useState(defaultPriority);

  // Hàm khi người dùng bấm thêm công việc
  const handleAdd = () => {
    // Khai báo trimmmedText để xoá khoảng trắng đầu và cuối
    const trimmedText = text.trim();

    // Rỗng thì không thêm
    if (trimmedText === "") {
      return;
    }

    // Gửi nội dung công việc đã xoá khoảng trắng đầu cuối và mức độ ưu tiên lên App để thêm Todo.
    onAdd(trimmedText, priority);

    // Reset ô nhập sau khi thêm
    setText("");
    setPriority(defaultPriority);
  };

  return (
    <View style={styles.inputSection}>
      {/* Khung chứa phần nhập công việc */}

      {/* Tạo ô nhập nội dung công việc */}
      <TextInput
        style={styles.textInput}
        placeholder="Nhập công việc mới..."
        placeholderTextColor="#94A3B8"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
      />

      {/* Hiển thị tiêu đề */}
      <Text style={styles.priorityTitle}>Độ ưu tiên:</Text>

      {/* Khung chứa mức độ ưu tiên */}
      <View style={styles.priorityRow}>
        {/* Duyệt danh sách mức độ ưu tiên để tạo từng nút Low, Medium, High. */}
        {priorityList.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.priorityButton,
              priority === item && styles.priorityButtonActive,
            ]}
            onPress={() => setPriority(item)}
          >
            <Text
              style={[
                styles.priorityButtonText,
                priority === item && styles.priorityButtonTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tạo một nút mức độ ưu tiên và hiển thị tên mức độ ưu tiên bên trong nút. */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Thêm công việc</Text>
      </TouchableOpacity>
    </View>
  );
}

// Component hiển thị một Todo và cho phép hoàn thành/xóa nó.
function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  // Khai báo danh sách style tương ứng với từng mức độ ưu tiên.
  const priorityStyle: Record<Priority, { backgroundColor: string }> = {
    Low: styles.priorityLow,
    Medium: styles.priorityMedium,
    High: styles.priorityHigh,
  };

  return (
    // Khung chứa một Todo.
    <View
      style={[
        // Style của Card Todo.
        styles.todoCard,

        // Độ bo tròn góc và độ mờ của Todo.
        {
          borderRadius: borderRadius,

          // Nếu Todo hoàn thành thì làm mờ, nếu chưa thì giữ nguyên.
          opacity: item.completed ? 0.55 : 1,
        },
      ]}
    >
      {/* Tạo nút Checkbox */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(item.id)}
      >
        <View
          style={[
            // Style của Checkbox.
            styles.checkboxInner,

            // Nếu Todo hoàn thành thì áp dụng style Checkbox hoàn thành.
            item.completed && styles.checkboxCompleted,
          ]}
        >
          {/* Nếu Todo hoàn thành thì hiển thị dấu ✓. */}
          {item.completed && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {/* Khung chứa nội dung Todo và Priority. */}
      <View style={styles.todoContent}>
        {/* Hiển thị nội dung công việc. */}
        <Text
          style={[
            // Style chữ Todo.
            styles.todoText,

            // Nếu hoàn thành thì áp dụng style chữ hoàn thành.
            item.completed && styles.todoTextCompleted,
          ]}
        >
          {item.text}
        </Text>

        {/* Tạo khung hiển thị Priority và áp dụng màu tương ứng. */}
        <View style={[styles.priorityTag, priorityStyle[item.priority]]}>
          {/* Hiển thị tên mức độ ưu tiên. */}
          <Text style={styles.priorityTagText}>{item.priority}</Text>
        </View>
      </View>

      {/* Tạo nút Xóa */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}

// Component chính, quản lý danh sách Todo và các chức năng thêm, hoàn thành, xóa Todo.
export default function App() {
  // Tạo danh sách Todo đầu cho app
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: `${STUDENT_ID}-001`,
      text: "Học React Native",
      completed: false,
      priority: defaultPriority,
    },
    {
      id: `${STUDENT_ID}-002`,
      text: "Hoàn thành bài tập Todo App",
      completed: false,
      priority: "High",
    },
  ]);

  // Thêm 1 todo vào danh sách
  const addTodo = (text: string, priority: Priority) => {
    const newTodo = {
      // ID công việc được sinh dựa trên STUDENT_ID
      id: `${STUDENT_ID}-${Date.now()}`,
      text: text,
      completed: false,
      priority: priority,
    };

    setTodos((currentTodos) => [newTodo, ...currentTodos]);
  };

  // Hàm đánh dấu Todo đã hoàn thành hoặc chưa hoàn thành khi người dùng bấm vào checkbox.
  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // Xoá 1 todo khỏi danh sách
  const deleteTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  // Đếm số todo đã hoàn thành
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header, đầu giao diện */}
      <View style={styles.header}>
        <View>
          {/* Hiển thị tiêu đề và mô tả */}
          <Text style={styles.title}>Todo App</Text>
          <Text style={styles.subtitle}>Quản lý công việc cá nhân</Text>
        </View>

        <View style={styles.studentBadge}>
          {/* Hiển thị MSSV */}
          <Text style={styles.studentText}>MSSV: {STUDENT_ID}</Text>
        </View>
      </View>

      {/* Component nhập công việc và gửi dữ liệu lên App để thêm Todo. */}
      <TodoInput onAdd={addTodo} />

      {/* Thống kê */}
      <View style={styles.statsCard}>
        <View>
          {/* Hiển thị tổng công việc */}
          <Text style={styles.statsLabel}>Tổng công việc</Text>

          <Text style={styles.statsNumber}>{todos.length}</Text>
        </View>

        <View style={styles.statsDivider} />

        <View>
          {/* Hiển thị công việc đã hoàn thành */}
          <Text style={styles.statsLabel}>Đã hoàn thành</Text>

          <Text style={[styles.statsNumber, { color: accentColor }]}>
            {completedCount}
          </Text>
        </View>
      </View>

      {/* Danh sách Todo */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
        }
      />

      {/* Footer, Cuối trang */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          MSSV: {STUDENT_ID} • Hoàn thành: {completedCount} task
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Khai báo StyleSheet, định nghĩa giao diện và bố cục cho toàn bộ ứng dụng.
const styles = StyleSheet.create({
  // Khung toàn bộ App
  container: {
    // Cho khung chiếm toàn bộ màn hình
    flex: 1,
    backgroundColor: "#0F172A",

    // Khoảng cách bên trái và bên phải.
    paddingHorizontal: paddingValue,
  },

  // Bố cục phần Header.
  header: {
    flexDirection: "row",

    // Đẩy hai phần nội dung ra hai bên.
    justifyContent: "space-between",

    // Căn các phần tử vào giữa theo chiều dọc.
    alignItems: "center",

    // Khoảng cách bên trên và bên dưới.
    paddingVertical: 20,
  },

  // Tiêu đề chính của ứng dụng.
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "bold",
  },

  // Mô tả nằm dưới tiêu đề.
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,

    // Tạo khoảng cách phía trên.
    marginTop: 4,
  },

  // Khung hiển thị MSSV.
  studentBadge: {
    backgroundColor: "#1E293B",

    // Khoảng cách bên trái và bên phải bên trong khung.
    paddingHorizontal: 10,

    // Khoảng cách bên trên và bên dưới bên trong khung.
    paddingVertical: 8,

    // Bo tròn các góc.
    borderRadius: 10,
  },

  // Chữ MSSV.
  studentText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Khung chứa phần nhập Todo.
  inputSection: {
    backgroundColor: "#1E293B",

    // Khoảng cách bên trong khung.
    padding: 14,

    // Độ bo tròn góc.
    borderRadius: borderRadius,

    // Khoảng cách phía dưới khung.
    marginBottom: 14,
  },

  // Ô nhập nội dung công việc.
  textInput: {
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#334155",

    // Bo tròn góc ô nhập.
    borderRadius: 10,

    // Khoảng cách bên trái và bên phải bên trong ô.
    paddingHorizontal: 14,

    // Khoảng cách bên trên và bên dưới bên trong ô.
    paddingVertical: 12,

    fontSize: 16,
  },

  // Tiêu đề "Độ ưu tiên".
  priorityTitle: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",

    // Tạo khoảng cách phía trên.
    marginTop: 12,

    // Tạo khoảng cách phía dưới.
    marginBottom: 8,
  },

  // Khung chứa các nút Priority.
  priorityRow: {
    flexDirection: "row",

    // Tạo khoảng cách giữa các nút.
    gap: 8,
  },

  // Nút chọn mức độ ưu tiên.
  priorityButton: {
    // Chia đều không gian cho các nút.
    flex: 1,

    // Căn nội dung vào giữa.
    alignItems: "center",

    // Khoảng cách bên trên và bên dưới bên trong nút.
    paddingVertical: 9,

    // Bo tròn góc.
    borderRadius: 8,

    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
  },

  // Style khi nút Priority đang được chọn.
  priorityButtonActive: {
    borderColor: accentColor,
    backgroundColor: "#164E63",
  },

  // Chữ của nút Priority.
  priorityButtonText: {
    color: "#94A3B8",
    fontWeight: "600",
  },

  // Chữ của nút Priority đang được chọn.
  priorityButtonTextActive: {
    color: "#F8FAFC",
  },

  // Nút thêm công việc.
  addButton: {
    backgroundColor: accentColor,

    // Căn nội dung vào giữa.
    alignItems: "center",

    // Khoảng cách bên trên và bên dưới bên trong nút.
    paddingVertical: 12,

    // Bo tròn góc.
    borderRadius: 10,

    // Khoảng cách phía trên nút.
    marginTop: 12,
  },

  // Chữ trên nút thêm công việc.
  addButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Khung hiển thị thống kê.
  statsCard: {
    // Sắp xếp các phần tử theo chiều ngang.
    flexDirection: "row",

    // Căn các phần tử vào giữa theo chiều dọc.
    alignItems: "center",

    // Chia đều khoảng cách giữa các phần tử.
    justifyContent: "space-around",

    backgroundColor: "#1E293B",
    borderRadius: borderRadius,

    // Khoảng cách bên trên và bên dưới bên trong khung.
    paddingVertical: 14,

    // Khoảng cách phía dưới khung.
    marginBottom: 14,
  },

  // Nhãn mô tả của thống kê.
  statsLabel: {
    color: "#94A3B8",
    fontSize: 12,

    // Căn chữ vào giữa.
    textAlign: "center",
  },

  // Số liệu thống kê.
  statsNumber: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",

    // Tạo khoảng cách phía trên.
    marginTop: 3,
  },

  // Đường phân cách giữa hai phần thống kê.
  statsDivider: {
    width: 1,
    height: 35,
    backgroundColor: "#475569",
  },

  // Khoảng cách cho nội dung danh sách.
  list: {
    paddingBottom: 10,
  },

  // Khung hiển thị từng Todo.
  todoCard: {
    // Sắp xếp checkbox, nội dung và nút Xóa theo chiều ngang.
    flexDirection: "row",

    // Căn các phần tử vào giữa theo chiều dọc.
    alignItems: "center",

    backgroundColor: "#1E293B",

    // Khoảng cách bên trong khung Todo.
    padding: 14,

    // Khoảng cách giữa các Todo.
    marginBottom: 10,

    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Shadow cho Android
    elevation: 3,
  },

  // Khoảng cách giữa checkbox và nội dung Todo.
  checkbox: {
    marginRight: 12,
  },

  // Khung bên trong của checkbox.
  checkboxInner: {
    width: 25,
    height: 25,

    // Bo tròn góc checkbox.
    borderRadius: 7,

    borderWidth: 2,
    borderColor: "#64748B",

    // Căn dấu ✓ vào giữa checkbox.
    alignItems: "center",
    justifyContent: "center",
  },

  // Style của checkbox khi Todo đã hoàn thành.
  checkboxCompleted: {
    backgroundColor: accentColor,
    borderColor: accentColor,
  },

  // Dấu ✓ trong checkbox.
  checkMark: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "bold",
  },

  // Cho phần nội dung Todo chiếm không gian còn lại.
  todoContent: {
    flex: 1,
  },

  // Nội dung công việc.
  todoText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "500",

    // Tạo khoảng cách phía dưới nội dung.
    marginBottom: 7,
  },

  // Style của nội dung khi Todo đã hoàn thành.
  todoTextCompleted: {
    // Gạch ngang nội dung Todo.
    textDecorationLine: "line-through",

    color: "#94A3B8",
  },

  // Khung chứa nhãn Priority.
  priorityTag: {
    // Đặt nhãn sát về phía đầu của khung.
    alignSelf: "flex-start",

    // Khoảng cách bên trái và bên phải bên trong nhãn.
    paddingHorizontal: 8,

    // Khoảng cách bên trên và bên dưới bên trong nhãn.
    paddingVertical: 3,

    // Bo tròn góc nhãn.
    borderRadius: 6,
  },

  // Màu nền cho Priority Low.
  priorityLow: {
    backgroundColor: "#166534",
  },

  // Màu nền cho Priority Medium.
  priorityMedium: {
    backgroundColor: "#854D0E",
  },

  // Màu nền cho Priority High.
  priorityHigh: {
    backgroundColor: "#991B1B",
  },

  // Chữ bên trong nhãn Priority.
  priorityTagText: {
    color: "#F8FAFC",
    fontSize: 11,
    fontWeight: "bold",
  },

  // Nút Xóa Todo.
  deleteButton: {
    // Tạo khoảng cách giữa nội dung Todo và nút Xóa.
    marginLeft: 10,

    // Khoảng cách bên trái và bên phải bên trong nút.
    paddingHorizontal: 9,

    // Khoảng cách bên trên và bên dưới bên trong nút.
    paddingVertical: 7,

    // Bo tròn góc nút.
    borderRadius: 7,

    backgroundColor: "#7F1D1D",
  },

  // Chữ trên nút Xóa.
  deleteButtonText: {
    color: "#FECACA",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Chữ hiển thị khi danh sách Todo trống.
  emptyText: {
    color: "#64748B",

    // Căn chữ vào giữa.
    textAlign: "center",

    // Tạo khoảng cách phía trên.
    marginTop: 30,

    fontSize: 15,
  },

  // Khung Footer.
  footer: {
    // Tạo đường viền phía trên Footer.
    borderTopWidth: 1,
    borderTopColor: "#334155",

    // Khoảng cách bên trên và bên dưới bên trong Footer.
    paddingVertical: 12,

    // Căn nội dung vào giữa.
    alignItems: "center",
  },

  // Chữ trong Footer.
  footerText: {
    color: "#64748B",
    fontSize: 12,
  },
});
