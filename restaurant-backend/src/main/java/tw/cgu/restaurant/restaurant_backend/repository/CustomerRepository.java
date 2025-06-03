package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * RepositoryRestResource(path = "customers")：
 *   - 將這個 repo 以 REST 形式暴露，路徑為 /customers
 */
@RepositoryRestResource(path = "customers")
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // 若要額外自訂 query method 可以加：
    // List<Customer> findByCNameContaining(String keyword);
}
