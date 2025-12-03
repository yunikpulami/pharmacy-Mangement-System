<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT id, username, email, phone FROM customers ORDER BY id DESC");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($customers);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
