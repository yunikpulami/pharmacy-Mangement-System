<?php
header('Content-Type: application/json');
require_once 'config.php';

$order_id = $_GET['order_id'] ?? 0;

try {
    // Get order details
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    
    // Get order items with medicine details including unit (with fallback)
    $stmt = $pdo->prepare("
        SELECT oi.*, m.name as medicine_name, 
        COALESCE(m.unit, 'Strip') as unit 
        FROM order_items oi 
        JOIN medicines m ON oi.medicine_id = m.id 
        WHERE oi.order_id = ?
    ");
    $stmt->execute([$order_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // If no items found, return empty array instead of failing
    if (empty($items)) {
        $items = [];
    }
    
    echo json_encode([
        'success' => true,
        'order' => $order,
        'items' => $items
    ]);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
