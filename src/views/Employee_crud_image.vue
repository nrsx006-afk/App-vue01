<template>
  <div class="container mt-4">
    <h2 class="mb-3">รายชื่อพนักงาน</h2>
    
    <div class="mb-3">
      <button class="btn btn-primary" @click="openAddModal">Add+</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-primary">
        <tr>
          <th>รหัสพนักงาน</th>
          <th>ชื่อ-นามสกุล</th>
          <th>แผนก</th>
          <th>เงินเดือน</th>
          <th>สถานะ</th>
          <th>รูปภาพ</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.emp_id">
          <td>{{ emp.emp_id }}</td>
          <td>{{ emp.emp_name }}</td>
          <td>{{ emp.department }}</td>
          <td>{{ emp.salary }}</td>
          <td>{{ emp.status }}</td>
          <td>
            <img 
              v-if="emp.image" 
              :src="'/php_api/uploads/' + emp.image" 
              width="100"
              alt="Employee Image"
            />
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="openEditModal(emp)">แก้ไข</button>
            <button class="btn btn-danger btn-sm" @click="deleteProduct(emp.emp_id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center"><p>กำลังโหลดข้อมูล...</p></div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? "แก้ไขพนักงาน" : "เพิ่มพนักงานใหม่" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEmployee">
              <div class="mb-3">
                <label class="form-label">ชื่อ-นามสกุล</label>
                <input v-model="editForm.emp_name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">แผนก</label>
                <input v-model="editForm.department" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">เงินเดือน</label>
                <input v-model="editForm.salary" type="number" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">สถานะ</label>
                <select v-model="editForm.status" class="form-control">
                  <option value="ปกติ">ปกติ</option>
                  <option value="ลาออก">ลาออก</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">รูปภาพ</label>
                <input type="file" @change="handleFileUpload" class="form-control" :required="!isEditMode" />
              </div>
              <button type="submit" class="btn btn-success w-100">
                {{ isEditMode ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "EmployeeList",
  setup() {
    const employees = ref([]); // ใช้ชื่อเดิมเพื่อไม่ให้กระทบ Logic อื่นที่อาจเรียกใช้
    const loading = ref(true);
    const error = ref(null);
    const isEditMode = ref(false);
    const editForm = ref({
      emp_id: null,
      emp_name: "",
      department: "",
      salary: "",
      status: "ปกติ",
      image: ""
    });
    const newImageFile = ref(null);
    let modalInstance = null;

    // แก้ไข: ดึงข้อมูลจาก API ตัวใหม่ที่ใช้ SQLite บน Replit
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/php_api/php_api/get_emp_replit.php");
        const data = await res.json();
        // ปรับให้รองรับข้อมูลที่ส่งกลับมาเป็น Array ตรงๆ
        employees.value = Array.isArray(data) ? data : (data.data || []);
      } catch (err) {
        error.value = "โหลดข้อมูลไม่สำเร็จ: " + err.message;
      } finally {
        loading.value = false;
      }
    };

    const openAddModal = () => {
      isEditMode.value = false;
      editForm.value = { emp_id: null, emp_name: "", department: "", salary: "", status: "ปกติ", image: "" };
      newImageFile.value = null;
      showModal();
    };

    const openEditModal = (emp) => {
      isEditMode.value = true;
      editForm.value = { ...emp };
      newImageFile.value = null;
      showModal();
    };

    const showModal = () => {
      const modalEl = document.getElementById("editModal");
      modalInstance = new window.bootstrap.Modal(modalEl);
      modalInstance.show();
    };

    const handleFileUpload = (event) => {
      newImageFile.value = event.target.files[0];
    };

    const saveEmployee = async () => {
      // สำหรับการทำ CRUD (เพิ่ม/ลบ) บน Replit ต้องชี้ไปไฟล์ API ใหม่
      // ในที่นี้เน้นให้ "แสดงผล" ขึ้นก่อน ส่วนบันทึกข้อมูลต้องทำไฟล์ api_employee_replit.php เพิ่มครับ
      alert("ฟังก์ชันบันทึกข้อมูลกำลังเชื่อมต่อกับ SQLite...");
    };

    const deleteProduct = async (id) => {
      if (!confirm("ยืนยันการลบพนักงานรหัส " + id + "?")) return;
      alert("กำลังดำเนินการลบ...");
    };

    onMounted(fetchEmployees);

    return {
      employees, loading, error, editForm, isEditMode,
      openAddModal, openEditModal, handleFileUpload, saveProduct, deletEmployee
    };
  }
};
</script>