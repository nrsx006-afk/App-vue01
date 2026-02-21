<template>
  <div class="container mt-5">
    <h2 class="text-danger mb-4">แสดงข้อมูลพนักงาน</h2>
    
    <button @click="showModal = true" class="btn btn-primary mb-3">Add +</button>

    <table class="table table-bordered table-hover text-center">
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
        <tr v-for="emp in employees" :key="emp.id">
          <td>{{ emp.code }}</td>
          <td>{{ emp.name }}</td>
          <td>{{ emp.dept }}</td>
          <td>{{ emp.salary.toLocaleString() }}.00</td>
          <td>
            <span :class="emp.status === 'ปกติ' ? 'text-success' : 'text-danger'">
              {{ emp.status }}
            </span>
          </td>
          <td>
            <img :src="emp.image" alt="emp" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
          </td>
          <td>
            <button @click="editEmp(emp)" class="btn btn-warning btn-sm me-1">แก้ไข</button>
            <button @click="deleteEmp(emp.id)" class="btn btn-danger btn-sm">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content p-4">
        <div class="d-flex justify-content-between">
          <h5>แก้ไขพนักงาน</h5>
          <button @click="showModal = false" class="btn-close"></button>
        </div>
        <hr>
        <label>ชื่อ-นามสกุล</label>
        <input v-model="currentEmp.name" class="form-control mb-2">
        <label>แผนก</label>
        <select v-model="currentEmp.dept" class="form-select mb-2">
          <option>เทคโนโลยี</option>
          <option>การตลาด</option>
          <option>บัญชี</option>
        </select>
        <label>เงินเดือน</label>
        <input v-model="currentEmp.salary" type="number" class="form-control mb-2">
        <button @click="saveEmp" class="btn btn-success w-100 mt-3">บันทึกการแก้ไข</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      employees: [
        { id: 8, code: '0000000008', name: 'มานะ ดีใจ', dept: 'เทคโนโลยี', salary: 35000, status: 'ปกติ', image: 'https://placekitten.com/100/100' },
      { id: 6, code: '0000000006', name: 'มานี มีนา', dept: 'เทคโนโลยี', salary: 25000, status: 'ปกติ', image: 'https://placeimg.com/100/100/nature' },
      { id: 5, code: '0000000005', name: 'นวรัตน์ เกิดผล', dept: 'เทคโนโลยี', salary: 25000, status: 'ปกติ', image: 'https://placeimg.com/100/100/tech' },
      { id: 4, code: '0000000004', name: 'สุดา พรมดี', dept: 'ทรัพยากรบุคคล', salary: 32000, status: 'ปกติ', image: 'https://placeimg.com/100/100/people' },
      { id: 3, code: '0000000003', name: 'อนันต์ สุขใจ', dept: 'การตลาด', salary: 25000, status: 'ลาออก', image: 'https://placeimg.com/100/100/arch' },
      { id: 2, code: '0000000002', name: 'สมหญิง ดีงาม', dept: 'บัญชี', salary: 28000, status: 'ปกติ', image: 'https://placeimg.com/100/100/animals' },
      { id: 1, code: '0000000001', name: 'สมชาย คนดี', dept: 'การตลาด', salary: 25000, status: 'ปกติ', image: 'https://placeimg.com/100/100/any' }
    
      ],
      currentEmp: { id: null, name: '', dept: '', salary: 0 }
    }
  },
  methods: {
    editEmp(emp) {
      this.currentEmp = { ...emp };
      this.showModal = true;
    },
    saveEmp() {
      const index = this.employees.findIndex(e => e.id === this.currentEmp.id);
      if (index !== -1) {
        this.employees[index] = { ...this.currentEmp };
        alert("แก้ไขข้อมูลเรียบร้อย");
      }
      this.showModal = false;
    },
    deleteEmp(id) {
      if (confirm("ยืนยันการลบข้อมูลพนักงาน?")) {
        this.employees = this.employees.filter(e => e.id !== id);
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white; border-radius: 10px; width: 450px;
}
.table th { vertical-align: middle; }
</style>