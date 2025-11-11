<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT SUM(total) as total_sales FROM orders");
    $total_sales = $stmt->fetch(PDO::FETCH_ASSOC)['total_sales'] ?? 0;
    
    $stmt = $pdo->query("SELECT COUNT(*) as total_customers FROM customers");
    $total_customers = $stmt->fetch(PDO::FETCH_ASSOC)['total_customers'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as total_medicines FROM medicines");
    $total_medicines = $stmt->fetch(PDO::FETCH_ASSOC)['total_medicines'];
    
    $stmt = $pdo->query("SELECT COUNT(*) as low_stock FROM medicines WHERE stock < 10");
    $low_stock = $stmt->fetch(PDO::FETCH_ASSOC)['low_stock'];
    
    echo json_encode([
        'total_sales' => $total_sales,
        'total_customers' => $total_customers,
        'total_medicines' => $total_medicines,
        'low_stock' => $low_stock
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'total_sales' => 0,
        'total_customers' => 0,
        'total_medicines' => 0,
        'low_stock' => 0
    ]);
}
?>
