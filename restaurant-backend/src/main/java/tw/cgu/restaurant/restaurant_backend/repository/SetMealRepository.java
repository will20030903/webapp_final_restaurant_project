package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.SetMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "sets")
public interface SetMealRepository extends JpaRepository<SetMeal, Long> {
}
