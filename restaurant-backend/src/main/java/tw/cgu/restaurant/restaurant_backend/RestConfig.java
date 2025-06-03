package tw.cgu.restaurant.restaurant_backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;

import tw.cgu.restaurant.restaurant_backend.model.Customer;
import tw.cgu.restaurant.restaurant_backend.model.Dish;
import tw.cgu.restaurant.restaurant_backend.model.OrderDetails;
import tw.cgu.restaurant.restaurant_backend.model.OrderInfo;
import tw.cgu.restaurant.restaurant_backend.model.SetDish;
import tw.cgu.restaurant.restaurant_backend.model.SetDishKey;
import tw.cgu.restaurant.restaurant_backend.model.SetMeal;
import tw.cgu.restaurant.restaurant_backend.model.TableInfo;

/**
 * 這個設定會讓所有由 Spring Data REST 自動暴露的 /api/** endpoint
 * 都帶上正確的 CORS header。
 */
@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        // 針對所有 /api/** 路徑開放 跨來源 http://localhost:5173
        cors.addMapping("/api/**")
            .allowedOrigins("http://163.25.107.227:5173")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
        config.exposeIdsFor(Customer.class,Dish.class,OrderDetails.class,OrderInfo.class,SetDish.class,SetDishKey.class,SetMeal.class,TableInfo.class);
        //要暴露id才能看到。
    }

    @Bean
    public Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();
        // You can configure features here if needed, for example:
        module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, true); // Temporarily enable this for diagnostics
        // module.configure(Hibernate6Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS, true);
        return module;
    }
}
