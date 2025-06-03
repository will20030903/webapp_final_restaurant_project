package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

/**
 * Set_Dish 的複合主鍵類別：由 sNo (套餐編號) + dNo (單點編號) 組成
 */
@Embeddable

@EqualsAndHashCode
public class SetDishKey implements Serializable {
    private static final long serialVersionUID = 1L;

  
    private Long sNo;

    private Long dNo;
    public SetDishKey() {
		
	}
	public SetDishKey(Long sNo, Long dNo) {
		super();
		this.sNo = sNo;
		this.dNo = dNo;
	}
	public Long getsNo() {
		return sNo;
	}
	public void setsNo(Long sNo) {
		this.sNo = sNo;
	}
	public Long getdNo() {
		return dNo;
	}
	public void setdNo(Long dNo) {
		this.dNo = dNo;
	}
}
