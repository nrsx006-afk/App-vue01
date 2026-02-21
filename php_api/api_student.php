<?php
// เชื่อมต่อฐานข้อมูล (ตรวจสอบว่าไฟล์ condb.php อยู่ในโฟลเดอร์เดียวกัน)
include 'condb.php'; 

// กำหนด Header ให้รองรับ JSON และ CORS (เผื่อรันข้ามพอร์ตใน Replit)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

try {
    if ($method === "GET") {
        // ดึงข้อมูลนักเรียนทั้งหมด (ไม่มีรูปภาพ)
        $stmt = $conn->prepare("SELECT student_id, first_name, last_name, phone, email FROM students ORDER BY student_id DESC");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $result]);
    } 
    elseif ($method === "POST") {
        // เพิ่มข้อมูลนักเรียน
        $stmt = $conn->prepare("INSERT INTO students (first_name, last_name, phone, email) VALUES (:f, :l, :p, :e)");
        $stmt->execute([
            ':f' => $input['first_name'],
            ':l' => $input['last_name'],
            ':p' => $input['phone'],
            ':e' => $input['email']
        ]);
        echo json_encode(["success" => true, "message" => "Added successfully"]);
    }
    elseif ($method === "DELETE") {
        // ลบข้อมูล
        $stmt = $conn->prepare("DELETE FROM students WHERE student_id = :id");
        $stmt->execute([':id' => $input['student_id']]);
        echo json_encode(["success" => true]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>