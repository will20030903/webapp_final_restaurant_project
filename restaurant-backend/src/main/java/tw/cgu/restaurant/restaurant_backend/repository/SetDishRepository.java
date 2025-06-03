package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.SetDish;
import tw.cgu.restaurant.restaurant_backend.model.SetDishKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "setDishes")
public interface SetDishRepository extends JpaRepository<SetDish, SetDishKey> {
}
