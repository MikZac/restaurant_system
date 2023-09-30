<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$order = $_SERVER['REQUEST_METHOD'];

switch($order) {
    case "POST":
        $order = json_decode(file_get_contents('php://input'));

        // Wstaw dane zamówienia do tabeli zamowienie
        $sqlInsertOrder = "INSERT INTO zamowienia (nr_stolika, status, wartosc, data_zamowienia, notatki ) VALUES (:nr_stolika, :status, :wartosc, NOW(), :notatki)";
        $stmtInsertOrder = $conn->prepare($sqlInsertOrder);
        $stmtInsertOrder->bindParam(':nr_stolika', $order->tableNumber);
        $stmtInsertOrder->bindValue(':status', 'Aktywne');
        $stmtInsertOrder->bindParam(':wartosc', $order->totalPrice);
        $stmtInsertOrder->bindParam(':notatki', $order->notes);

        if ($stmtInsertOrder->execute()) {
            $lastOrderId = $conn->lastInsertId(); // Pobierz ID ostatnio dodanego zamówienia

            // Wstaw zamówione dania do tabeli zamowienie_dania
            foreach ($order->items as $item) {
                $dishName = $item->dishName;
                $quantity = $item->quantity;

                // Pobierz ID dania na podstawie jego nazwy
                $sqlSelectDishId = "SELECT id FROM menu WHERE name = :dishName";
                $stmtSelectDishId = $conn->prepare($sqlSelectDishId);
                $stmtSelectDishId->bindParam(':dishName', $dishName);
                $stmtSelectDishId->execute();
                $dishId = $stmtSelectDishId->fetchColumn();

                // Wstaw danie do zamowienie_dania
                $sqlInsertOrderDish = "INSERT INTO zamowienia_dania (id_zamowienia, id_dania, ilosc) VALUES (:id_zamowienia, :id_dania, :ilosc)";
                $stmtInsertOrderDish = $conn->prepare($sqlInsertOrderDish);
                $stmtInsertOrderDish->bindParam(':id_zamowienia', $lastOrderId);
                $stmtInsertOrderDish->bindParam(':id_dania', $dishId);
                $stmtInsertOrderDish->bindParam(':ilosc', $quantity);
                $stmtInsertOrderDish->execute();
            }

            $response = ['status' => 1, 'message' => 'Zamówienie zostało dodane poprawnie.'];
        } else {
            $response = ['status' => 0, 'message' => 'Błąd podczas dodawania zamówienia.'];
        }

        echo json_encode($response);
        break;

        case "GET":
            if (isset($_GET['id_zamowienia'])) {

                $orderId = $_GET['id_zamowienia'];
    
                // Zapytanie SQL do pobrania konkretnej zamówienia o podanym ID
                $sqlGetOrder = "SELECT z.id_zamowienia, z.nr_stolika, z.status, z.wartosc, z.data_zamowienia, z.notatki,
                                zd.id_dania, m.name AS nazwa_dania, m.ingredients AS opis_dania, m.price AS cena_dania, m.type AS typ_dania, zd.ilosc
                                FROM zamowienia z
                                LEFT JOIN zamowienia_dania zd ON z.id_zamowienia = zd.id_zamowienia
                                LEFT JOIN menu m ON zd.id_dania = m.id
                                WHERE z.id_zamowienia = :id_zamowienia";
    
                $stmtGetOrder = $conn->prepare($sqlGetOrder);
                $stmtGetOrder->bindParam(':id_zamowienia', $orderId);
                $stmtGetOrder->execute();
    
                // Pobierz dane zamówienia
                $orderData = $stmtGetOrder->fetchAll(PDO::FETCH_ASSOC);
    
                if (!empty($orderData)) {
                    echo json_encode($orderData);
                } else {
                    echo json_encode(['message' => 'Nie znaleziono zamówienia o podanym ID.']);
                }
            } else {
                // Jeśli nie przekazano parametru 'id_zamowienia' w zapytaniu GET, zwróć wszystkie zamówienia
                $sqlGetOrders = "SELECT z.id_zamowienia, z.nr_stolika, z.status, z.wartosc, z.data_zamowienia, z.notatki,
                                zd.id_dania, m.name AS nazwa_dania, m.ingredients AS opis_dania, m.price AS cena_dania, m.type AS typ_dania, zd.ilosc
                                FROM zamowienia z
                                LEFT JOIN zamowienia_dania zd ON z.id_zamowienia = zd.id_zamowienia
                                LEFT JOIN menu m ON zd.id_dania = m.id";
    
                $stmtGetOrders = $conn->query($sqlGetOrders);
                $orders = [];
    
                while ($row = $stmtGetOrders->fetch(PDO::FETCH_ASSOC)) {
                    $orderId = $row['id_zamowienia'];
    
                    if (!isset($orders[$orderId])) {
                        $orders[$orderId] = [
                            'id_zamowienia' => $orderId,
                            'nr_stolika' => $row['nr_stolika'],
                            'status' => $row['status'],
                            'wartosc' => $row['wartosc'],
                            'notatki' => $row['notatki'],
                            'data_zamowienia' => $row['data_zamowienia'],
                            'dania' => [],
                        ];
                    }
    
                    if (!empty($row['id_dania'])) {
                        $orders[$orderId]['dania'][] = [
                            'id_dania' => $row['id_dania'],
                            'nazwa_dania' => $row['nazwa_dania'],
                            'ilosc' => $row['ilosc'],
                            'opis_dania' => $row['opis_dania'],
                            'cena_dania' => $row['cena_dania'],
                            'typ_dania' => $row['typ_dania'],
                        ];
                    }
                }
    
                $ordersList = array_values($orders);
    
                echo json_encode($ordersList);
            }
            break;
            case "PUT":
                $order = json_decode(file_get_contents('php://input'));
                
                $orderId = $order->id_zamowienia;
                
                try {
                    $conn->beginTransaction();

                    $sqlDeleteAllItems = "DELETE FROM zamowienia_dania WHERE id_zamowienia = :id_zamowienia";
                    $stmtDeleteAllItems = $conn->prepare($sqlDeleteAllItems);
                    $stmtDeleteAllItems->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT);
                    $stmtDeleteAllItems->execute();
            
                    if (isset($order->tableNumber)) {
                        $sqlUpdateTableNumber = "UPDATE zamowienia SET nr_stolika = :nr_stolika WHERE id_zamowienia = :id_zamowienia";
                        $stmtUpdateTableNumber = $conn->prepare($sqlUpdateTableNumber);
                        $stmtUpdateTableNumber->bindParam(':nr_stolika', $order->tableNumber, PDO::PARAM_INT);
                        $stmtUpdateTableNumber->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT); 
                        $stmtUpdateTableNumber->execute();
                    }
            

                    if (isset($order->notes)) {
                        $sqlUpdateNotes = "UPDATE zamowienia SET notatki = :notatki WHERE id_zamowienia = :id_zamowienia";
                        $stmtUpdateNotes = $conn->prepare($sqlUpdateNotes);
                        $stmtUpdateNotes->bindParam(':notatki', $order->notes);
                        $stmtUpdateNotes->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT); 
                        $stmtUpdateNotes->execute();
                    }
            

                    foreach ($order->items as $item) {
                        $dishName = $item->dishName;
                        $quantity = $item->ilosc;
            

                        if ($quantity <= 0) {
                            continue;
                        }

                        $sqlSelectDishId = "SELECT id FROM menu WHERE name = :dishName";
                        $stmtSelectDishId = $conn->prepare($sqlSelectDishId);
                        $stmtSelectDishId->bindParam(':dishName', $dishName);
                        $stmtSelectDishId->execute();
                        $dishId = $stmtSelectDishId->fetchColumn();
            
                        if ($dishId) {
                            $sqlInsertOrderDish = "INSERT INTO zamowienia_dania (id_zamowienia, id_dania, ilosc) VALUES (:id_zamowienia, :id_dania, :ilosc)";
                            $stmtInsertOrderDish = $conn->prepare($sqlInsertOrderDish);
                            $stmtInsertOrderDish->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT);
                            $stmtInsertOrderDish->bindParam(':id_dania', $dishId, PDO::PARAM_INT);
                            $stmtInsertOrderDish->bindParam(':ilosc', $quantity, PDO::PARAM_INT); 
                            $stmtInsertOrderDish->execute();
                        } else {
                            throw new Exception("Nie znaleziono dania o nazwie: $dishName");
                        }
                    }
            
                    // Jeśli wszystko jest w porządku, zatwierdź transakcję
                    $conn->commit();
            
                    if (isset($order->totalPrice)) {
                        $sqlUpdateTotalPrice = "UPDATE zamowienia SET wartosc = :wartosc WHERE id_zamowienia = :id_zamowienia";
                        $stmtUpdateTotalPrice = $conn->prepare($sqlUpdateTotalPrice);
                        $stmtUpdateTotalPrice->bindParam(':wartosc', $order->totalPrice);
                        $stmtUpdateTotalPrice->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT); 
                        $stmtUpdateTotalPrice->execute();
                    }
            
                    $response = ['status' => 1, 'message' => 'Zamówienie zostało zaktualizowane poprawnie.'];
                    echo json_encode($response);
                } catch (PDOException $e) {
                    // Obsługa błędów związanych z bazą danych
                    $conn->rollBack();
                    $response = ['status' => 0, 'message' => 'Błąd bazy danych: ' . $e->getMessage()];
                    echo json_encode($response);
                } catch (Exception $e) {
                    // Obsługa innych błędów
                    $conn->rollBack();
                    $response = ['status' => 0, 'message' => 'Wystąpił błąd: ' . $e->getMessage()];
                    echo json_encode($response);
                }
                break;
                case "DELETE":
                    $orderId = $_GET['id_zamowienia'];
                
                    try {
                        $conn->beginTransaction();
                
                        $sqlDeleteItems = "DELETE FROM zamowienia_dania WHERE id_zamowienia = :id_zamowienia";
                        $stmtDeleteItems = $conn->prepare($sqlDeleteItems);
                        $stmtDeleteItems->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT);
                        $stmtDeleteItems->execute();
                
                        $sqlDeleteOrder = "DELETE FROM zamowienia WHERE id_zamowienia = :id_zamowienia";
                        $stmtDeleteOrder = $conn->prepare($sqlDeleteOrder);
                        $stmtDeleteOrder->bindParam(':id_zamowienia', $orderId, PDO::PARAM_INT);
                        $stmtDeleteOrder->execute();
                
                        $conn->commit();
                
                        $response = ['status' => 1, 'message' => 'Zamówienie zostało usunięte poprawnie.'];
                        echo json_encode($response);
                    } catch (PDOException $e) {
                        $conn->rollBack();
                        $response = ['status' => 0, 'message' => 'Błąd bazy danych: ' . $e->getMessage()];
                        echo json_encode($response);
                    } catch (Exception $e) {
                        $conn->rollBack();
                        $response = ['status' => 0, 'message' => 'Wystąpił błąd: ' . $e->getMessage()];
                        echo json_encode($response);
                    }
                    break;
            
        
    }
    ?>