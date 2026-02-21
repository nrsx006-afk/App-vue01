<template>
  <div class="container mt-5">
    <h2 class="text-danger mb-4">แสดงข้อมูลพนักงาน</h2>
    
    <button @click="showAddAlert" class="btn btn-primary mb-3">Add +</button>

    <table class="table table-bordered table-hover text-center align-middle">
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
            <img :src="emp.image" class="rounded border" style="width: 50px; height: 50px; object-fit: cover;">
          </td>
          <td>
            <button @click="editEmp(emp)" class="btn btn-warning btn-sm me-1">แก้ไข</button>
            <button @click="deleteEmp(emp.id)" class="btn btn-danger btn-sm">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content p-4 shadow-lg text-start" style="width: 450px;">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="m-0">แก้ไขพนักงาน</h5>
          <button @click="showModal = false" class="btn-close"></button>
        </div>
        <hr>
        
        <div class="mb-3">
          <label class="form-label small text-muted">ชื่อ-นามสกุล</label>
          <input v-model="currentEmp.name" class="form-control">
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">แผนก</label>
          <select v-model="currentEmp.dept" class="form-select">
            <option>เทคโนโลยี</option>
            <option>การตลาด</option>
            <option>บัญชี</option>
            <option>ทรัพยากรบุคคล</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">เงินเดือน</label>
          <input v-model="currentEmp.salary" type="number" class="form-control">
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">สถานะ</label>
          <select v-model="currentEmp.status" class="form-select">
            <option>ปกติ</option>
            <option>ลาออก</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">รูปภาพ</label>
          <div class="d-flex align-items-center border p-1 rounded bg-light">
            <button class="btn btn-white btn-sm border me-2 shadow-sm">Choose File</button>
            <span class="small text-muted">spuc.jpg</span>
          </div>
        </div>

        <button @click="saveEmp" class="btn btn-success w-100 mt-2">บันทึกการแก้ไข</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      // รายชื่อพนักงาน 7 คนตามตัวอย่างอาจารย์
      employees: [
        { id: 8, code: '0000000008', name: 'มานะ ดีใจ', dept: 'เทคโนโลยี', salary: 35000, status: 'ปกติ', image: 'https://placekitten.com/100/100' },
        { id: 6, code: '0000000006', name: 'มานี มีนา', dept: 'เทคโนโลยี', salary: 25000, status: 'ปกติ', image: 'https://placekitten.com/101/101' },
        { id: 5, code: '0000000005', name: 'นวรัตน์ เกิดผล', dept: 'เทคโนโลยี', salary: 25000, status: 'ปกติ', image: 'https://placekitten.com/102/102' },
        { id: 4, code: '0000000004', name: 'สุดา พรมดี', dept: 'ทรัพยากรบุคคล', salary: 32000, status: 'ปกติ', image: 'https://placekitten.com/103/103' },
        { id: 3, code: '0000000003', name: 'อนันต์ สุขใจ', dept: 'การตลาด', salary: 25000, status: 'ลาออก', image: 'https://placekitten.com/104/104' },
        { id: 2, code: '0000000002', name: 'สมหญิง ดีงาม', dept: 'บัญชี', salary: 28000, status: 'ปกติ', image: 'https://placekitten.com/105/105' },
        { id: 1, code: '0000000001', name: 'สมชาย คนดี', dept: 'การตลาด', salary: 25000, status: 'ปกติ', image: 'https://placekitten.com/106/106' }
      ],
      currentEmp: { id: null, name: '', dept: '', salary: 0, status: 'ปกติ' }
    }
  },
  methods: {
    // เมื่อกดปุ่มแก้ไข จะดึงข้อมูลเดิมขึ้นมาโชว์ในช่อง Input
    editEmp(emp) {
      this.currentEmp = { ...emp };
      this.showModal = true;
    },
    saveEmp() {
      const index = this.employees.findIndex(e => e.id === this.currentEmp.id);
      if (index !== -1) {
        this.employees[index] = { ...this.currentEmp };
      }
      this.showModal = false;
      alert("บันทึกการแก้ไขเรียบร้อย");
    },
    deleteEmp(id) {
      if (confirm("คุณต้องการลบข้อมูลพนักงานคนนี้ใช่หรือไม่?")) {
        this.employees = this.employees.filter(e => e.id !== id);
      }
    },
    showAddAlert() {
      alert("เปิดหน้าต่างเพิ่มพนักงาน");
    }
  }
}
</script>

<style scoped>
/* พื้นหลังมืดเมื่อแสดง Modal */
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
/* สไตล์ของกล่องแก้ไข */
.modal-content {
  background: white; border-radius: 12px; border: none;
}
.table img {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.form-label {
  font-weight: 500;
}
</style>