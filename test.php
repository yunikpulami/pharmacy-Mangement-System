<?php
// Simple test to check if PHP and database are working
echo "<h1>System Check</h1>";

// Check PHP
echo "<h2>1. PHP Status</h2>";
echo "<p style='color: green;'>✓ PHP is working! Version: " . phpversion() . "</p>";

// Check database connection
echo "<h2>2. Database Connection</h2>";
$host = 'localhost';
$dbname = 'pharmacy_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green;'>✓ Database connected successfully!</p>";
    
    // Check if customers table exists
    echo "<h2>3. Customers Table</h2>";
    $stmt = $pdo->query("SHOW TABLES LIKE 'customers'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Customers table exists</p>";
        
        // Show table structure
        $stmt = $pdo->query("DESCRIBE customers");
        echo "<h3>Table Structure:</h3>";
        echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
        echo "<tr style='background: #f0f0f0;'><th>Field</th><th>Type</th><th>Null</th><th>Key</th></tr>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>{$row['Field']}</td>";
            echo "<td>{$row['Type']}</td>";
            echo "<td>{$row['Null']}</td>";
            echo "<td>{$row['Key']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Count customers
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM customers");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "<p>Total customers in database: <strong>{$count}</strong></p>";
        
        echo "<h2>✓ Everything looks good!</h2>";
        echo "<p>You can now try to register at: <a href='register.html'>register.html</a></p>";
        
    } else {
        echo "<p style='color: red;'>✗ Customers table does NOT exist!</p>";
        echo "<h3 style='color: red;'>ACTION REQUIRED:</h3>";
        echo "<ol>";
        echo "<li>Open phpMyAdmin: <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
        echo "<li>Click on 'SQL' tab</li>";
        echo "<li>Copy all content from <strong>database/setup.sql</strong></li>";
        echo "<li>Paste it in the SQL box and click 'Go'</li>";
        echo "<li>Refresh this page</li>";
        echo "</ol>";
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>✗ Database connection failed!</p>";
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo "<h3 style='color: red;'>Database 'pharmacy_db' does not exist!</h3>";
        echo "<p><strong>ACTION REQUIRED:</strong></p>";
        echo "<ol>";
        echo "<li>Open phpMyAdmin: <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
        echo "<li>Click on 'SQL' tab</li>";
        echo "<li>Copy all content from <strong>database/setup.sql</strong></li>";
        echo "<li>Paste it in the SQL box and click 'Go'</li>";
        echo "<li>Refresh this page</li>";
        echo "</ol>";
    } else {
        echo "<p>Make sure XAMPP/WAMP MySQL is running!</p>";
    }
}
?>
