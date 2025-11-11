<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT id, fullname, email, phone FROM customers ORDER BY fullname");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($customers);
} catch(PDOException $e) {
    echo json_encode([]);
}
?>
