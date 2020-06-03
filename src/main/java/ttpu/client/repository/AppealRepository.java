package ttpu.client.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ttpu.client.entity.Appeal;


/**
 * @author Mr_Inspiration
 * @since 19.01.2020
 */
@Repository
public interface AppealRepository extends JpaRepository<Appeal,Integer> {
}
