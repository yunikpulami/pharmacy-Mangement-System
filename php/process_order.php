<?php
header('Content-Type: application/json');
require_once 'config.php';

$customer_id = $_POST['customer_id'] ?? 0;
$total = $_POST['total'] ?? 0;
$payment_method = $_POST['payment_method'] ?? 'cash';
$delivery_address = $_POST['delivery_address'] ?? '';
$items = json_decode($_POST['items'] ?? '[]', true);

if (empty($items)) {
    echo json_encode(['success' => false, 'message' => 'Cart is empty']);
    exit;
}

if (empty($delivery_address)) {
    echo json_encode(['success' => false, 'message' => 'Delivery address is required']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Check stock availability
    foreach ($items as $item) {
        $stmt = $pdo->prepare("SELECT stock FROM medicines WHERE id = ?");
        $stmt->execute([$item['id']]);
        $medicine = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$medicine || $medicine['stock'] < $item['quantity']) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Insufficient stock for some items']);
            exit;
        }
    }
    
    // Create order
    $stmt = $pdo->prepare("INSERT INTO orders (customer_id, total, payment_method, delivery_address, status) VALUES (?, ?, ?, ?, 'completed')");
    $stmt->execute([$customer_id, $total, $payment_method, $delivery_address]);
    $order_id = $pdo->lastInsertId();
    
    // Add order items and update stock
    foreach ($items as $item) {
        $stmt = $pdo->prepare("INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
        
        $stmt = $pdo->prepare("UPDATE medicines SET stock = stock - ? WHERE id = ?");
        $stmt->execute([$item['quantity'], $item['id']]);
    }
    
    $pdo->commit();
    echo json_encode(['success' => true, 'order_id' => $order_id]);
} catch(PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Order processing failed: ' . $e->getMessage()]);
}
?>
