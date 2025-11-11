<?php
header('Content-Type: application/json');
require_once 'config.php';

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$description = $_POST['description'] ?? '';

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE medicines SET name = ?, category = ?, price = ?, stock = ?, description = ? WHERE id = ?");
        $stmt->execute([$name, $category, $price, $stock, $description, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO medicines (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $category, $price, $stock, $description]);
    }
    
    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Operation failed']);
}
?>
