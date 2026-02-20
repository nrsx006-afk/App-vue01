<template>
  <div class="container mt-5">
    <h2 class="text-primary mb-4">รายชื่อนักศึกษา</h2>
    
    <button @click="showAddModal = true" class="btn btn-primary mb-3">Add +</button>

    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>ชื่อ-นามสกุล</th>
          <th>คณะ/สาขา</th>
          <th>เบอร์โทรศัพท์</th>
          <th>แก้ไข/ลบ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in students" :key="student.id">
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.faculty }}</td>
          <td>{{ student.phone }}</td>
          <td>
            <button @click="editStudent(student)" class="btn btn-warning btn-sm me-2">แก้ไข</button>
            <button @click="deleteStudent(student.id)" class="btn btn-danger btn-sm">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-content p-4">
        <h4>{{ isEdit ? 'แก้ไขข้อมูลนักศึกษา' : 'เพิ่มนักศึกษาใหม่' }}</h4>
        <input v-model="currentStudent.name" placeholder="ชื่อ-นามสกุล" class="form-control mb-2">
        <input v-model="currentStudent.faculty" placeholder="คณะ/สาขา" class="form-control mb-2">
        <input v-model="currentStudent.phone" placeholder="เบอร์โทรศัพท์" class="form-control mb-2">
        <button @click="saveStudent" class="btn btn-success me-2">บันทึก</button>
        <button @click="closeModal" class="btn btn-secondary">ยกเลิก</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddModal: false,
      isEdit: false,
      students: [
        { id: 1, name: 'สมชาย ใจดี', faculty: 'เทคโนโลยีสารสนเทศ', phone: '0812345678' },
        { id: 2, name: 'วิภา สุขสันต์', faculty: 'บริหารธุรกิจ', phone: '0898765432' }
      ],
      currentStudent: { id: null, name: '', faculty: '', phone: '' }
    }
  },
  methods: {
    saveStudent() {
      if (this.isEdit) {
        const index = this.students.findIndex(s => s.id === this.currentStudent.id);
        this.students[index] = { ...this.currentStudent };
        alert("แก้ไขข้อมูลเรียบร้อย");
      } else {
        const newId = this.students.length + 1;
        this.students.push({ ...this.currentStudent, id: newId });
        alert("เพิ่มข้อมูลเรียบร้อย");
      }
      this.closeModal();
    },
    editStudent(student) {
      this.isEdit = true;
      this.currentStudent = { ...student };
      this.showAddModal = true;
    },
    deleteStudent(id) {
      if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
        this.students = this.students.filter(s => s.id !== id);
        alert("ลบข้อมูลเรียบร้อย");
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.isEdit = false;
      this.currentStudent = { id: null, name: '', faculty: '', phone: '' };
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white; border-radius: 8px; width: 400px;
}
</style>