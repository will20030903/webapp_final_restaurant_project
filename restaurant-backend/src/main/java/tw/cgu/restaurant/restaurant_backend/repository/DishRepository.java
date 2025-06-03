package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "dishes")
public interface DishRepository extends JpaRepository<Dish, Integer> {
}
