<?php
header('Content-Type: application/json');
require_once 'config.php';

$id = $_GET['id'] ?? 0;

try {
    $stmt = $pdo->prepare("SELECT * FROM medicines WHERE id = ?");
    $stmt->execute([$id]);
    $medicine = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($medicine);
} catch(PDOException $e) {
    echo json_encode([]);
}
?>
