package tw.cgu.restaurant.restaurant_backend.repository;

import tw.cgu.restaurant.restaurant_backend.model.TableInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "tables")
public interface TableInfoRepository extends JpaRepository<TableInfo, Long> {
}
