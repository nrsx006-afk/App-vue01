<template>
  <div class="container mt-4">
    <h2>รายชื่อนักศึกษา</h2>
    <table class="table table-bordered mt-3">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>ชื่อ-นามสกุล</th>
          <th>เบอร์โทร</th>
          <th>อีเมล</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.student_id">
          <td>{{ s.student_id }}</td>
          <td>{{ s.first_name }} {{ s.last_name }}</td>
          <td>{{ s.phone }}</td>
          <td>{{ s.email }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteStudent(s.student_id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const students = ref([]);

// ดึงข้อมูล (GET)
const fetchStudents = async () => {
  try {
    // แก้ Path ให้ตรงกับที่อยู่ไฟล์จริงใน Replit
    const res = await fetch("https://App-vue01.replit.app/php_api/api_student.php"); 
    const data = await res.json();
    if (data.success) {
      students.value = data.data; // นำข้อมูลใส่ในตัวแปร students
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

// ลบข้อมูล (DELETE)
const deleteStudent = async (id) => {
  if(!confirm("ยืนยันการลบ?")) return;
  await fetch("https://App-vue01.replit.app/php_api/api_student.php", {
    method: "DELETE",
    body: JSON.stringify({ student_id: id })
  });
  fetchStudents();
};

onMounted(fetchStudents); // เรียกทำงานทันทีที่โหลดหน้า
</script>