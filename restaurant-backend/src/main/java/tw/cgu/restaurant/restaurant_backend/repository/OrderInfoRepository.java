package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.OrderInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "orders")
public interface OrderInfoRepository extends JpaRepository<OrderInfo, Long> {
}
